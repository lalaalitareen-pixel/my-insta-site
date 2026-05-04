<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <div id="root">
        <!-- React App will mount here -->
        <noscript>You need to enable JavaScript to run this app.</noscript>
    </div>
    <?php wp_footer(); ?>
</body>
</html>
