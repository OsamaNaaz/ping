export function logOut () {
    localStorage.removeItem("user");
    window.location.href = "/";
}
export function currentUser() {
    return localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
}