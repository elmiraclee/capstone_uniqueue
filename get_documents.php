<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "db.php";

$office_id = $_GET['office_id'];

$sql = "
SELECT *
FROM documents
WHERE office_id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $office_id);
$stmt->execute();

$result = $stmt->get_result();

$documents = [];

while ($row = $result->fetch_assoc()) {

    $document_id = $row['id'];

    $reqSql = "
        SELECT requirement
        FROM document_requirements
        WHERE document_id = ?
    ";

    $reqStmt = $conn->prepare($reqSql);
    $reqStmt->bind_param("i", $document_id);
    $reqStmt->execute();

    $reqResult = $reqStmt->get_result();

    $requirements = [];

    while ($req = $reqResult->fetch_assoc()) {
        $requirements[] = $req['requirement'];
    }

    $row['requirements'] = $requirements;

    $documents[] = $row;
}

echo json_encode([
    "success" => true,
    "documents" => $documents
]);