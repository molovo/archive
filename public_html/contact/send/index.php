<?php
  function e($text) {
    return htmlentities($text, ENT_QUOTES, 'UTF-8', false);
  }

  $input =  array(
              'name'          => e($_POST['name']),
              'project-type'  => e($_POST['project-type']),
              'budget'        => e($_POST['budget']),
              'release-date'  => e($_POST['release-date']),
              'email'         => e($_POST['email']),
              'message'       => e($_POST['message'])
            );

  $message  = "Name: "          . $input['name']          . "\n";
  $message .= "Project Type: "  . $input['project-type']  . "\n";
  $message .= "Budget: "        . $input['budget']        . "\n";
  $message .= "Release Date: "  . $input['release-date']  . "\n";
  $message .= "Email: "         . $input['email']         . "\n";
  $message .= "Message: "       . $input['message']       . "\n";

  $headers = 'From: no-reply@molovo.co' . "\r\n" .
             'Reply-To: ' . $input['email'] . "\r\n" .
             'X-Mailer: PHP/' . phpversion();

  if (@mail('hi@molovo.co.uk', 'Molovo - New message from ' . $input['name'], $message, $headers)) {
    header('Location: http://' . $_SERVER['HTTP_HOST'] . '/contact/thanks');
  }
?>