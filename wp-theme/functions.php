<?php
/**
 * MyInsta APK theme functions and definitions
 */

function myinsta_apk_scripts() {
    // Enqueue the compiled React styles and scripts from the dist folder
    // Note: In a real WP environment, you would upload the contents of the 'dist' folder
    // to your theme directory and reference them here.
    wp_enqueue_style('myinsta-style', get_template_directory_uri() . '/dist/index.css', array(), '1.0.0');
    wp_enqueue_script('myinsta-script', get_template_directory_uri() . '/dist/index.js', array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'myinsta_apk_scripts');

function myinsta_apk_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
}
add_action('after_setup_theme', 'myinsta_apk_setup');
?>
