<?php

header("Content-Type: application/json");

error_reporting(E_ALL);
ini_set('display_errors', 1);

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];

$stmt = mysqli_prepare($conn, "
    UPDATE windows
    SET name = ?, status = ?, speed = ?, queue_type = ?
    WHERE id = ?
");

mysqli_stmt_bind_param(
    $stmt,
    "ssssi",
    $data['name'],
    $data['status'],
    $data['speed'],
    $data['queue_type'],
    $id
);

if (!mysqli_stmt_execute($stmt)) {
    echo json_encode([
        "success" => false,
        "message" => mysqli_stmt_error($stmt)
    ]);
    exit;
}

$delStmt = mysqli_prepare($conn, "
    DELETE FROM window_document
    WHERE window_id = ?
");

mysqli_stmt_bind_param($delStmt, "i", $id);
mysqli_stmt_execute($delStmt);

$docStmt = mysqli_prepare($conn, "
    INSERT INTO window_document (window_id, document_id)
    VALUES (?, ?)
");

foreach ($data['documents'] as $doc) {
    mysqli_stmt_bind_param($docStmt, "ii", $id, $doc);
    mysqli_stmt_execute($docStmt);
}

echo json_encode([
    "success" => true
]);
?>