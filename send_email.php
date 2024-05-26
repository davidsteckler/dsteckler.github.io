<?php
use \Mailjet\Resources;

require 'vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];

    $mj = new \Mailjet\Client('9137307eacb8dc327d2ae9335132e722', 'bbf92e65e4957b1ea25f6b2413efd4dc', true, ['version' => 'v3.1']);
    $body = [
        'Messages' => [
            [
                'From' => [
                    'Email' => "your-email@example.com",
                    'Name' => "David Steckler"
                ],
                'To' => [
                    [
                        'Email' => $email,
                        'Name' => "Subscriber"
                    ]
                ],
                'Subject' => "Thank you for subscribing!",
                'TextPart' => "Dear Subscriber, thank you for subscribing to our email list.",
                'HTMLPart' => "<h3>Dear Subscriber,</h3><br />Thank you for subscribing to our email list."
            ]
        ]
    ];
    $response = $mj->post(Resources::$Email, ['body' => $body]);
    if ($response->success()) {
        echo "Email sent successfully.";
    } else {
        echo "Failed to send email.";
    }
}
?>
