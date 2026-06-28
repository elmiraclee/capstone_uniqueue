<?php

header("Content-Type: application/json");

// Ipakita ang PHP errors
error_reporting(E_ALL);
ini_set('display_errors', 1);

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "No data received"
    ]);
    exit;
}

$name      = $data['name'] ?? '';
$office_id = $data['office_id'] ?? 0;
$status    = $data['status'] ?? '';
$speed     = $data['speed'] ?? '';

$stmt = mysqli_prepare($conn, "
    INSERT INTO windows (name, office_id, status, speed)
    VALUES (?, ?, ?, ?)
");

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);
    exit;
}

mysqli_stmt_bind_param($stmt, "siss", $name, $office_id, $status, $speed);

if (!mysqli_stmt_execute($stmt)) {
    echo json_encode([
        "success" => false,
        "message" => mysqli_stmt_error($stmt)
    ]);
    exit;
}

$window_id = mysqli_insert_id($conn);

if (!empty($data['documents'])) {

    $docStmt = mysqli_prepare($conn, "
        INSERT INTO window_document (window_id, document_id)
        VALUES (?, ?)
    ");

    foreach ($data['documents'] as $doc) {
        mysqli_stmt_bind_param($docStmt, "ii", $window_id, $doc);
        mysqli_stmt_execute($docStmt);
    }
}

echo json_encode([
    "success" => true,
    "message" => "Window added successfully"
]);
?>