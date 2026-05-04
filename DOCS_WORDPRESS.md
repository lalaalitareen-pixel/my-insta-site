# Exporting Your MyInsta APK Site to WordPress

Since you requested a professional APK download site that can be used on WordPress, I have structured this project specifically for that purpose.

## Project Structure
- **/dist**: Contains the compiled React application (HTML, CSS, JS).
- **/wp-theme**: Contains the core WordPress theme files.

## How to Install as a WordPress Theme

1. **Build the assets**: 
   - I have already compiled the project. You can find the necessary files in the `dist/` directory.

2. **Combine files**:
   - Create a new folder on your computer named `myinsta-theme`.
   - Copy all files from the `wp-theme/` folder into this new folder.
   - Inside your new folder, create a subfolder named `dist`.
   - Copy `dist/index.js` and `dist/index.css` from this project into that new `dist` folder.

3. **Upload to WordPress**:
   - Zip the `myinsta-theme` folder.
   - Log in to your WordPress Admin dashboard.
   - Go to **Appearance > Themes > Add New > Upload Theme**.
   - Select your `myinsta-theme.zip` and click **Install Now**.
   - Activate the theme.

## Features Included
- **Vibrant Premium Design**: Professional gradient-based UI similar to premium sites like `myinsta.com.in`.
- **Search & Filter**: Real-time searching for different APK packages.
- **Clone vs UnClone**: Detailed installation instructions for both types of mods.
- **Modern Interactions**: Smooth scrolling and entrance animations using `motion`.
- **Optimized for WP**: Simplified asset enqueuing in `functions.php`.

## Note
The current theme is a "Single Page App" (SPA) style. If you want to use WordPress's native posts or pages to manage the APK content dynamically, you would need to modify `functions.php` to fetch data from the WordPress API (REST API) instead of the static `APK_DATA` array in `App.tsx`.
