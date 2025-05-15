# Sirius Auth API

This API allows you to authenticate with Facebook and retrieve your Facebook pages, Instagram account, and post to Instagram.

## Endpoints

- `/login`: Redirects to Facebook for authentication.
- `/callback`: Handles the Facebook authentication callback and retrieves the user access token.
- `/pages`: Retrieves the user's Facebook pages.
- `/instagram`: Retrieves the Instagram account linked to a Facebook page.
- `/post`: Posts an image to Instagram.

## Deployment

1.  Create a new repository on [GitHub](https://github.com).
2.  Initialize a local Git repository in the project directory:
    ```bash
    git init
    ```
3.  Add the project files to the local repository:
    ```bash
    git add .
    ```
4.  Commit the project files to the local repository:
    ```bash
    git commit -m "Initial commit"
    ```
5.  Link the local repository to the remote GitHub repository:
    ```bash
    git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
    ```
    Replace `<YOUR_GITHUB_REPOSITORY_URL>` with the URL of your GitHub repository.
6.  Push the project files to the remote GitHub repository:
    ```bash
    git push -u origin main
    ```
7.  Go to [Render](https://render.com) and create a new account or log in.
8.  Click on "New Web Service".
9.  Connect your GitHub account and select the repository you created in step 1.
10. Configure the following settings:
    - **Runtime:** Node
    - **Build command:** `npm install`
    - **Start command:** `npm start`
    - **Node Version:** >=16
11. Add the following environment variables:
    - `FB_APP_ID`: Your Facebook App ID.
    - `FB_APP_SECRET`: Your Facebook App Secret.
    - `REDIRECT_URI`: The URL of your Render app, e.g. `https://your-app.onrender.com/callback`.
12. Click on "Deploy".

## Usage

1. Go to `/login` to authenticate with Facebook.
2. After authenticating, you will be redirected to `/callback` with a user access token.
3. Use the `/pages` endpoint to retrieve your Facebook pages.
4. Use the `/instagram` endpoint to retrieve the Instagram account linked to a Facebook page.
5. Use the `/post` endpoint to post an image to Instagram.

## OpenAPI

The `openapi.yaml` file can be used to integrate this API with ChatGPT.
