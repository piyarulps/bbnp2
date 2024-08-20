<IfModule mod_headers.c>
  # Set allow Access-Control-Allow-Origin header
  Header set Access-Control-Allow-Origin "*"
</IfModule>

# Allow HTTP Authorization
RewriteEngine On
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule .* - [e=HTTP_AUTHORIZATION:%1]



<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Force non-www
  RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
  RewriteRule ^(.*)$ https://%1%{REQUEST_URI} [L,R=301]
  
  # Redirection of requests to index.html
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
  RewriteRule ^.*$ - [NC,L]
  
  # Redirect all non-file routes to index.html
  RewriteRule ^(?!.*\.).*$ index.html [NC,L]
</IfModule>


#AuthType Basic
#AuthName "restricted area"
#AuthUserFile /home/postlogin/.htpasswd
#require valid-user

# php -- BEGIN cPanel-generated handler, do not edit
# Set the “ea-php82” package as the default “PHP” programming language.
<IfModule mime_module>
  AddHandler application/x-httpd-ea-php82 .php .php8 .phtml
</IfModule>
# php -- END cPanel-generated handler, do not edit
