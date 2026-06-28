<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];

if (!$id) {
    echo json_encode(["success" => false, "message" => "Missing ID"]);
    exit;
}

// 1. delete requirements first
$reqSql = "DELETE FROM document_requirements WHERE document_id = ?";
$reqStmt = $conn->prepare($reqSql);
$reqStmt->bind_param("i", $id);
$reqStmt->execute();

// 2. delete document
$sql = "DELETE FROM documents WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Delete failed"]);
}