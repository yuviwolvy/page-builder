# page-builder
Kind of a blog page builder somewhat like blogger that creates and publishes a blog page by taking all informations from the user.

**NOTE:** This project is still under development

## Technologies used:
- HTML
- Bootstrap
- Node
- MongoDB

## Key Features:
- Signup/Signin along with authentication.
- Protected routes.
- Integration of rich text editor for blog's main content. 
- Attachment file upload functionality.
- Scheduled publishing of the blog.
- Drafting functionality

## How to run the project?
1. Create or sign in to MongoDB. Craete a new project, then create a new database, then create username and password for connection authentication of that database.
2. Clone the repository.
3. Go to the backend folder.
4. Create a .env file in the root of this directory. Add MONGO_USERNAME and MONGO_PASSWORD from the first step.
5. Do "npm i".
6. Run "nodemon"
7. Now if you want to run Frontend just install the live server extension and click on "Go Live" from your bottom right corner.
8. If you want to run the blog listing page go to the ForAllUser folder. Do "npm i" Run "modemon". Go to the returned port, most probably it will be 3000.

**NOTE:** Backend must be running for any of the frontend or blog listing page.

## For contribution
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes.
4. Push your branch: `git push origin feature-name`.
5. Create a pull request.