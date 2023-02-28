window.onload = () => {
  const toggleMode = document.getElementById('darkmode-toggle');
  const body_element = document.getElementById('body-light');
  const main_element = document.getElementById('main-light');
  // Selects all in both html files
  const textMainSwitch = document.querySelectorAll('.main-text');
  const headerMainSwitch = document.querySelectorAll('.main-header');
  const logoMainSwitch = document.querySelectorAll('.header-logo');
  const longlogoMainSwitch = document.querySelectorAll('.long-logo');
  const textLightSwitch = document.querySelectorAll('.light-mode-text');
  const headerLightSwitch = document.querySelectorAll('.light-mode-header');
  const logoLightSwitch = document.querySelectorAll('.light-mode-header-logo');
  const longlogoLightSwitch = document.querySelectorAll('.light-mode-long-logo');
  toggleMode.addEventListener('click', function () {
    console.log({ toggleMode });
    if (toggleMode.checked) {
      // When toggle is checked, dark mode is enabled
      body_element.classList.toggle('light-mode-body');
      main_element.classList.toggle('light-mode-main');
      iterateChangeElement(textMainSwitch, 'light-mode-text', 'main-text');
      iterateChangeElement(textLightSwitch, 'light-mode-text', 'main-text');
      iterateChangeElement(
        headerMainSwitch,
        'light-mode-header',
        'main-header'
      );
      iterateChangeElement(
        headerLightSwitch,
        'light-mode-header',
        'main-header'
      );
      iterateChangeElement(logoMainSwitch, 'light-mode-header-logo', 'header-logo');
      iterateChangeElement(logoLightSwitch, 'light-mode-header-logo', 'header-logo');
      iterateChangeElement(longlogoMainSwitch, 'light-mode-long-logo', 'long-logo');
      iterateChangeElement(longlogoLightSwitch, 'light-mode-long-logo', 'long-logo');
    } else {
      body_element.classList.toggle('light-mode-body');
      main_element.classList.toggle('light-mode-main');
      iterateChangeElement(textMainSwitch, 'main-text', 'light-mode-text');
      iterateChangeElement(textLightSwitch, 'main-text', 'light-mode-text');
      iterateChangeElement(
        headerMainSwitch,
        'main-header',
        'light-mode-header'
      );
      iterateChangeElement(
        headerLightSwitch,
        'main-header',
        'light-mode-header'
      );
      iterateChangeElement(logoMainSwitch, 'header-logo', 'light-mode-header-logo');
      iterateChangeElement(logoLightSwitch, 'header-logo', 'light-mode-header-logo');
      iterateChangeElement(longlogoMainSwitch, 'long-logo', 'light-mode-long-logo');
      iterateChangeElement(longlogoLightSwitch, 'long-logo', 'light-mode-long-logo');
      console.log('Unchecked');
    }
  });
};

/*
 * @iterateChangeElement - Takes an array of Html objects and iterates throgh them with
 * a callback function
 * @listofHtmlElemet - Array of htmlObjects
 * @classNameOne - Class name to check if exist on object and pass through to call back
 * @classNameTwo - Class name to add to html object
 */
const iterateChangeElement = (
  listOfHtmlElement,
  classNameOne,
  classNameTwo
) => {
  listOfHtmlElement.forEach((htmlElement) => {
    addRemoveClassName(htmlElement, classNameOne, classNameTwo);
  });
};

/*
 * addRemoveClassName
 * @htmlElement - Element that is checked
 * @classNameOne - Class name to check if it exists on the Element and remove if true
 * @classNameTwo - Class name to add to element
 */
function addRemoveClassName (htmlElement, classNameOne, classNameTwo) {
  if (htmlElement.classList.contains(classNameOne)) {
    htmlElement.classList.remove(classNameOne);
    htmlElement.classList.add(classNameTwo);
  }
}
