import { REGEXP } from "../../utils/constants.js";
import { loginUser } from "./loginModel.js";

//===================================================================================================================
export function loginController(loginForm) {

    //-------------------------------------------------------------------------------------------------------------------
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const userEmailElement = loginForm.querySelector("#mail");
        const userEmail = userEmailElement.value;

        const passwordElement = loginForm.querySelector("#password");
        const password = passwordElement.value;

        const emailRegExp = new RegExp(REGEXP.mail);

        if (emailRegExp.test(userEmail)) {

            handleLoginUser(userEmail, password)

        } else {

            dispatchNotification('login-error', 'Incorrect mail format')
            //dispatchLoginError(loginForm, 'Incorrect mail format');
        }
    })

    //-------------------------------------------------------------------------------------------------------------------
    async function handleLoginUser(userEmail, password) {

        try {

            /*          
            const existingToken = localStorage.getItem("accessToken");

            if (existingToken) {
                throw new Error("There is already an active session. Log out before logging in with another user.");
            } 
            */

            //----------------------------------------------------
            const event = new CustomEvent("load-posts-started");
            loginForm.dispatchEvent(event);
            //----------------------------------------------------

            //====================================================
            const token = await loginUser(userEmail, password);
            //====================================================

            dispatchNotification('login-ok', {
                message: "You have successfully logged in.",
                type: 'success'
            })
            //dispatchLoginSuccess(loginForm, 'You have successfully logged in.');

            localStorage.setItem("accessToken", token)

            setTimeout(() => { window.location = '/index.html' }, 1000);

        } catch (error) {

            dispatchNotification('login-error', error.message)
            //dispatchLoginError(loginForm, error.message);
        } finally {
            //----------------------------------------------------
            const event = new CustomEvent("load-posts-finished")
            loginForm.dispatchEvent(event)
            //----------------------------------------------------
        }
    }
    //-------------------------------------------------------------------------------------------------------------------
    function dispatchNotification(eventType, message) {
        const event = new CustomEvent(eventType, { detail: message })
        loginForm.dispatchEvent(event)
    }
    //-------------------------------------------------------------------------------------------------------------------
    /*     function dispatchLoginSuccess(loginForm, successMessage) {
            const event = new CustomEvent("login-ok", {
                detail: {
                    message: successMessage,
                    type: 'success'
                }
            });
            loginForm.dispatchEvent(event);
        }
    
        function dispatchLoginError(loginForm, errorMessage) {
            const event = new CustomEvent("login-error", {
                detail: errorMessage
            });
            loginForm.dispatchEvent(event);
        } */
}

