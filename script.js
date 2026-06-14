/*
 * script.js
 * Description: This file handles all interactive functionalities for the E-Death Note web application.
 * It manages adding and removing names, displaying death specificities, and toggling between dark and light themes.
 * All data is persistently stored using the browser's localStorage.
 */

// DOM Element References: Cache frequently accessed DOM elements for performance.
const input = document.getElementById("name-input"); // Input field for entering names
const addBtn = document.getElementById("add-btn"); // Button to add a name
const list = document.getElementById("death-list"); // Unordered list where names are displayed
const modal = document.getElementById("modal-overlay"); // The modal overlay for death specificities
const deathDesc = document.getElementById("death-desc"); // Textarea within the modal for death description
const yesBtn = document.getElementById("yes-btn"); // Button in modal to confirm death specificity
const noBtn = document.getElementById("no-btn"); // Button in modal to skip death specificity (default to heart attack)
const themeToggle = document.getElementById("theme-toggle"); // The container for the theme toggle icon
const toggleIcon = document.getElementById("toggle-icon"); // The actual icon (moon/sun) for theme toggle

// State Variable: Stores the name temporarily while the modal is open.
let pendingName = ""; // Holds the name entered by the user before confirming death details

/*
 * setTheme(theme)
 * Description: Applies the selected theme (dark or light) to the document and updates the toggle icon.
 * Parameters:
 *   theme (string): "dark" or "light" - the theme to apply.
 * Why it's written this way: Uses CSS custom properties (variables) for easy theme switching.
 * By changing the `data-theme` attribute on the `<html>` element, CSS rules defined with `[data-theme="light"]`
 * will override the default `:root` variables, effectively switching the theme.
 */
function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme); // Set data-theme attribute on <html>
    localStorage.setItem("theme", theme); // Persist theme preference in localStorage
    // Update the icon based on the current theme for visual feedback
    toggleIcon.textContent = theme === "light" ? "☀️" : "🌙"; // Sun for light, Moon for dark
}

/*
 * save()
 * Description: Saves the current list of names and their death descriptions to the browser's localStorage.
 * This ensures data persists across browser sessions.
 * Why it's written this way: Iterates through each displayed entry, extracts its name and description,
 * and stores them as a JSON string in localStorage under the key 'eDeathNoteFinal'.
 */
function save() {
    const entries = Array.from(document.querySelectorAll(".entry")).map(el => ({
        name: el.querySelector(".victim-name").textContent, // Get the victim's name
        desc: el.querySelector(".death-note").textContent // Get the death description
    }));
    localStorage.setItem("eDeathNoteFinal", JSON.stringify(entries)); // Store as JSON string
}

/*
 * renderEntry(name, desc)
 * Description: Creates and appends a new list item (entry) to the #death-list.
 * This function is responsible for dynamically displaying names and their associated death details.
 * Parameters:
 *   name (string): The name of the person to be displayed.
 *   desc (string): The description of their death.
 * How it works: Constructs an `<li>` element with nested `<div>` and `<span>` elements for styling.
 * It also attaches an event listener to the "Erase" button for removing the entry.
 */
function renderEntry(name, desc) {
    const li = document.createElement("li"); // Create a new list item element
    li.className = "entry"; // Assign the 'entry' class for styling
    li.innerHTML = `
        <div class="entry-header">
            <span class="victim-name">${name}</span>
            <span class="erase-link">Erase</span>
        </div>
        <div class="death-note">${desc}</div>
    `;

    // Add event listener to the 'Erase' button within this new entry
    li.querySelector(".erase-link").onclick = () => {
        li.style.opacity = "0"; // Start fade-out animation
        // After animation, remove the element from DOM and save the updated list
        setTimeout(() => { li.remove(); save(); }, 300);
    };

    list.prepend(li); // Add the new entry to the beginning of the list
}

/*
 * triggerModal()
 * Description: Initiates the process of adding a new name. It validates the input,
 * stores the name temporarily, clears the input field, and displays the modal for death specificities.
 * Why it's written this way: Separates the name input from the death description input,
 * providing a guided user experience as requested.
 */
function triggerModal() {
    const name = input.value.trim(); // Get and trim the name from the input field
    if (!name) return; // If no name is entered, do nothing
    pendingName = name; // Store the name temporarily
    input.value = ""; // Clear the input field
    modal.style.display = "flex"; // Show the modal
    deathDesc.focus(); // Focus on the textarea for immediate input
}

/*
 * yesBtn.onclick
 * Description: Event handler for the "Seal Fate" button in the modal.
 * It takes the death description (or defaults to heart attack) and renders the new entry.
 */
yesBtn.onclick = () => {
    // Use the entered description, or default to "Heart Attack" if textarea is empty
    const desc = deathDesc.value.trim() || "Died of a sudden heart attack after 40 seconds.";
    renderEntry(pendingName, desc); // Render the new entry with name and description
    closeModal(); // Close the modal
};

/*
 * noBtn.onclick
 * Description: Event handler for the "Heart Attack" button in the modal.
 * It defaults the death description to "Heart Attack" and renders the new entry.
 */
noBtn.onclick = () => {
    renderEntry(pendingName, "Died of a sudden heart attack after 40 seconds."); // Render with default description
    closeModal(); // Close the modal
};

/*
 * closeModal()
 * Description: Hides the modal, clears the death description textarea, and resets the pending name.
 * It also triggers the save function to persist changes.
 */
function closeModal() {
    modal.style.display = "none"; // Hide the modal
    deathDesc.value = ""; // Clear the textarea
    pendingName = ""; // Reset the pending name
    save(); // Save the updated list to localStorage
}

// Event Listeners: Attach functions to user interactions.
addBtn.onclick = triggerModal; // When 'WRITE' button is clicked, trigger the modal
input.onkeypress = (e) => { if(e.key === "Enter") triggerModal(); }; // Trigger modal on Enter key press in input field

// Initial Load Logic: Executes when the page finishes loading.
window.onload = () => {
    // Load and apply saved theme preference
    const savedTheme = localStorage.getItem("theme") || "dark"; // Get saved theme or default to dark
    setTheme(savedTheme); // Apply the theme
    
    // Load and render saved death note entries
    const saved = JSON.parse(localStorage.getItem("eDeathNoteFinal") || "[]"); // Get saved entries or an empty array
    saved.forEach(entry => renderEntry(entry.name, entry.desc)); // Render each saved entry
};
