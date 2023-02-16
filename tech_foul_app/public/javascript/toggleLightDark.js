window.onload = () => {
  const toggleMode = document.getElementById('darkmode-toggle');
  const body_element = document.getElementById('body-light');
  const main_element = document.getElementById('main-light');
  const textMainSwitch = document.querySelectorAll('.main-text');
  const headerMainSwitch = document.querySelectorAll('.main-header');
  const textLightSwitch = document.querySelectorAll('.light-mode-text');
  const headerLightSwitch = document.querySelectorAll('.light-mode-header');
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
function addRemoveClassName(htmlElement, classNameOne, classNameTwo) {
  if (htmlElement.classList.contains(classNameOne)) {
    htmlElement.classList.remove(classNameOne);
    htmlElement.classList.add(classNameTwo);
  }
}
