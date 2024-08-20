<?php
// Assuming the subscriber's details are passed via GET request
$subscriberEmail = $_GET['email'];


// Compose the email subject and body for the backend team
$subject = "New Newsletter Subscription Alert!";
$body_table = "
<html>
<head>
  <title>New Newsletter Subscription</title>
</head>
<body>
  <h1>New Subscription Alert!</h1>
  <p>A new user has subscribed to the newsletter.</p>
  <p>Here are the details:</p>
  <ul>
     <li><strong>Email:</strong> $subscriberEmail</li>
  </ul>
  <p>Please ensure to add this email to the newsletter mailing list.</p>
  <p>Best regards,<br>Your Website Team</p>
</body>
</html>
";

$subject='Baroda BNP Paribas MF - App Email Subscription';      
 $frmemail='info@barodabnpparibasmf.in';
 $frmname='Post Login  App -New user subscription alert!';
 $urlEncode = urlencode($body_table);
 $mailList = "support@celesttechnologies.com";
 
    $url = 'https://api2.juvlon.com/v4/httpSendMail';
 $data='{"ApiKey":"OTU1OTUjIyMyMDIzLTA1LTE4IDEyOjEzOjA2",
        "requests":
       [{
           "subject":"'.$subject.'",
           "from":"'.$frmemail.'",
           "fromName":"'.$frmname.'",
           "body":"'.$urlEncode.'",
           "to":"'.$mailList.'",
           "trackOpens":"1",
           "trackClicks":"1"             
       }]
    }';
            
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
            echo $res1 = curl_exec($ch);
            curl_close($ch);

?>
