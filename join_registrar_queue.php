<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$student_id = $data['student_id'];
$office_id = $data['office_id'];
$type = $data['type'];
$priority = $data['priority'] ? 1 : 0;
$priority_reason = $data['priority_reason'] ?? '';
$appointment_date = $data['appointment_date'] ?? null;
$documents = $data['documents'];

$getLast = mysqli_query(
    $conn,
    "SELECT id FROM queue_tickets
     ORDER BY id DESC LIMIT 1"
);

$lastId = 0;

if(mysqli_num_rows($getLast) > 0){
    $row = mysqli_fetch_assoc($getLast);
    $lastId = $row['id'];
}

$nextId = $lastId + 1;

$queueNumber =
    'Q-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

$sql = "INSERT INTO queue_tickets(
            student_id,
            office_id,
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

if(mysqli_query($conn, $sql)){

    $ticketId = mysqli_insert_id($conn);

    foreach($documents as $doc){

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
        "queue_number" => $queueNumber
    ]);

}else{

    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);
}