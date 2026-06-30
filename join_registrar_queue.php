<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$student_id = $data['student_id'];
$office_id = $data['office_id'];
$type = $data['type']; // walkin or appointment
$priority = $data['priority'] ? 1 : 0;
$priority_reason = $data['priority_reason'] ?? '';
$appointment_date = $data['appointment_date'] ?? null;
$documents = $data['documents'];

$windowName = 'Not Assigned';
$windowId = null;
$assignedWindows = [];


// =====================================================
// FIND ASSIGNED WINDOW
// =====================================================

$windowName = 'Not Assigned';
$windowId = null;
$assignedWindows = [];

// =====================================================
// APPOINTMENT
// =====================================================

if ($type == 'appointment') {

    $query = mysqli_query(
        $conn,
        "SELECT
            w.id,
            w.name,

            (
                SELECT COUNT(*)
                FROM queue_tickets qt
                WHERE qt.window_id = w.id
                AND qt.status IN ('waiting','serving')
            ) AS current_queue

        FROM windows w

        WHERE w.office_id = '$office_id'
        AND w.status = 'open'
        AND w.queue_type = 'appointment'

        ORDER BY current_queue ASC

        LIMIT 1"
    );

    if (mysqli_num_rows($query) > 0) {

        $row = mysqli_fetch_assoc($query);

        $windowId = $row['id'];
        $windowName = $row['name'];
    }
}

// =====================================================
// WALK-IN
// =====================================================

else if ($type == 'walkin' && !empty($documents)) {

    $documentIds = [];

    foreach ($documents as $doc) {
        $documentIds[] = intval($doc['document_id']);
    }

    // =====================================================
    // SINGLE DOCUMENT
    // =====================================================

    if (count($documentIds) == 1) {

        $documentId = $documentIds[0];

        $query = mysqli_query(
            $conn,
            "SELECT
                w.id,
                w.name,

                COUNT(DISTINCT wd2.document_id)
                    AS total_supported_docs,

                (
                    SELECT COUNT(*)
                    FROM queue_tickets qt
                    WHERE qt.window_id = w.id
                    AND qt.status IN ('waiting','serving')
                ) AS current_queue

            FROM windows w

            INNER JOIN window_document wd
                ON w.id = wd.window_id

            INNER JOIN window_document wd2
                ON w.id = wd2.window_id

            WHERE wd.document_id = '$documentId'
            AND w.office_id = '$office_id'
            AND w.status = 'open'
            AND w.queue_type = 'walkin'

            GROUP BY w.id

            ORDER BY
                current_queue ASC,
                total_supported_docs ASC

            LIMIT 1"
        );

        if (mysqli_num_rows($query) > 0) {

            $row = mysqli_fetch_assoc($query);

            $windowId = $row['id'];
            $windowName = $row['name'];
        }
    }

    // =====================================================
    // MULTIPLE DOCUMENTS
    // =====================================================

    else {

        $totalDocs = count($documentIds);

        $commonQuery = mysqli_query(
            $conn,
            "SELECT
                w.id,
                w.name,

                (
                    SELECT COUNT(*)
                    FROM queue_tickets qt
                    WHERE qt.window_id = w.id
                    AND qt.status IN ('waiting','serving')
                ) AS current_queue,

                COUNT(DISTINCT wd.document_id)
                    AS total_docs

            FROM windows w

            INNER JOIN window_document wd
                ON w.id = wd.window_id

            WHERE wd.document_id IN (" .
                implode(',', $documentIds) . ")

            AND w.office_id = '$office_id'
            AND w.status = 'open'
            AND w.queue_type = 'walkin'

            GROUP BY w.id

            HAVING total_docs = $totalDocs

            ORDER BY current_queue ASC

            LIMIT 1"
        );

        if (mysqli_num_rows($commonQuery) > 0) {

            $row = mysqli_fetch_assoc($commonQuery);

            if ($row['current_queue'] < 5) {

                $windowId = $row['id'];
                $windowName = $row['name'];
            }

            else {

                foreach ($documentIds as $documentId) {

                    $query = mysqli_query(
                        $conn,
                        "SELECT
                            w.id,
                            w.name,

                            (
                                SELECT COUNT(*)
                                FROM queue_tickets qt
                                WHERE qt.window_id = w.id
                                AND qt.status IN ('waiting','serving')
                            ) AS current_queue

                        FROM windows w

                        INNER JOIN window_document wd
                            ON w.id = wd.window_id

                        WHERE wd.document_id = '$documentId'
                        AND w.office_id = '$office_id'
                        AND w.status = 'open'
                        AND w.queue_type = 'walkin'

                        ORDER BY current_queue ASC

                        LIMIT 1"
                    );

                    if (mysqli_num_rows($query) > 0) {

                        $row = mysqli_fetch_assoc($query);

                        if ($windowId == null) {
                            $windowId = $row['id'];
                        }

                        if (!in_array(
                            $row['name'],
                            $assignedWindows
                        )) {

                            $assignedWindows[] =
                                $row['name'];
                        }
                    }
                }

                $windowName =
                    implode(', ', $assignedWindows);
            }
        }
    }
}


// =====================================================
// GENERATE QUEUE NUMBER
// =====================================================

$getLast = mysqli_query(
    $conn,
    "SELECT id
     FROM queue_tickets
     ORDER BY id DESC
     LIMIT 1"
);

$lastId = 0;

if (mysqli_num_rows($getLast) > 0) {

    $row = mysqli_fetch_assoc($getLast);

    $lastId = $row['id'];
}

$nextId = $lastId + 1;

$queueNumber = 'Q-' .
    str_pad($nextId, 4, '0', STR_PAD_LEFT);


// =====================================================
// INSERT QUEUE TICKET
// =====================================================

$sql = "INSERT INTO queue_tickets(
            student_id,
            office_id,
            window_id,
            queue_number,
            type,
            status,
            priority,
            priority_reason,
            appointment_date,
            joined_at,
            created_at,
            updated_at
        )

        VALUES(
            '$student_id',
            '$office_id',
            " . ($windowId ? "'$windowId'" : "NULL") . ",
            '$queueNumber',
            '$type',
            'waiting',
            '$priority',
            '$priority_reason',
            " . ($appointment_date
                ? "'$appointment_date'"
                : "NULL") . ",
            NOW(),
            NOW(),
            NOW()
        )";


if (mysqli_query($conn, $sql)) {

    $ticketId = mysqli_insert_id($conn);

    // =====================================================
    // SAVE DOCUMENTS
    // =====================================================

    foreach ($documents as $doc) {

        $documentId = $doc['document_id'];
        $quantity = $doc['quantity'];

        mysqli_query(
            $conn,
            "INSERT INTO queue_ticket_document(
                ticket_id,
                document_id,
                quantity
            )
            VALUES(
                '$ticketId',
                '$documentId',
                '$quantity'
            )"
        );
    }

    echo json_encode([
        "success" => true,
        "queue_number" => $queueNumber,
        "window_name" => $windowName
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);
}

?>