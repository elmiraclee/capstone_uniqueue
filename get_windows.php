<?php

header("Content-Type: application/json");
include "db.php";

$office_id = $_GET['office_id'];

$stmt = mysqli_prepare($conn, "
    SELECT * FROM windows WHERE office_id = ?
");
mysqli_stmt_bind_param($stmt, "i", $office_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$windows = [];

while ($row = mysqli_fetch_assoc($result)) {

    $window_id = $row['id'];

    $docs = [];

    // FIXED: "windows_document" -> "window_document"
    $docStmt = mysqli_prepare($conn, "
        SELECT d.id, d.name
        FROM window_document wd
        INNER JOIN documents d ON wd.document_id = d.id
        WHERE wd.window_id = ?
    ");
    mysqli_stmt_bind_param($docStmt, "i", $window_id);
    mysqli_stmt_execute($docStmt);
    $docResult = mysqli_stmt_get_result($docStmt);

    while ($doc = mysqli_fetch_assoc($docResult)) {
        $docs[] = $doc;
    }

    $row['documents'] = $docs;
    $windows[] = $row;
}

echo json_encode([
    "success" => true,
    "windows" => $windows
]);