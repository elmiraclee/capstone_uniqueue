<?php

header("Content-Type: application/json");
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];

// FIXED: "windows_document" -> "window_document"
$delDocsStmt = mysqli_prepare($conn, "
    DELETE FROM window_document WHERE window_id = ?
");
mysqli_stmt_bind_param($delDocsStmt, "i", $id);
mysqli_stmt_execute($delDocsStmt);

$delWinStmt = mysqli_prepare($conn, "
    DELETE FROM windows WHERE id = ?
");
mysqli_stmt_bind_param($delWinStmt, "i", $id);
mysqli_stmt_execute($delWinStmt);

echo json_encode([
    "success" => true
]);