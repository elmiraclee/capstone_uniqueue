<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$name = $data['name'];
$daily_capacity = $data['daily_capacity'];
$processing_time = $data['processing_time'];
$requirements = $data['requirements'];

if (!$id) {
    echo json_encode(["success" => false, "message" => "Missing ID"]);
    exit;
}

// 1. update document
$sql = "UPDATE documents 
        SET name = ?, daily_capacity = ?, processing_time = ?
        WHERE id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("siii", $name, $daily_capacity, $processing_time, $id);

if ($stmt->execute()) {

    // 2. delete old requirements
    $delSql = "DELETE FROM document_requirements WHERE document_id = ?";
    $delStmt = $conn->prepare($delSql);
    $delStmt->bind_param("i", $id);
    $delStmt->execute();

    // 3. insert new requirements
    if (!empty($requirements)) {
        $reqSql = "INSERT INTO document_requirements (document_id, requirement)
                   VALUES (?, ?)";

        $reqStmt = $conn->prepare($reqSql);

        foreach ($requirements as $req) {
            $reqStmt->bind_param("is", $id, $req);
            $reqStmt->execute();
        }
    }

    echo json_encode(["success" => true]);

} else {
    echo json_encode(["success" => false, "message" => "Update failed"]);
}