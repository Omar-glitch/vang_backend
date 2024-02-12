const ModalPersona = new bootstrap.Modal(
  document.getElementById("ModalPersona")
);

const on = (element, event, selector, handler) => {
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};

const editClient = (e) => {
  e.preventDefault();
};

on(document, "click", ".btnEditar", (e) => {
  const fila = e.target.parentNode.parentNode;
  name_input.value = fila.children[0].innerHTML;
  contact_input.value = fila.children[1].innerHTML;
  ModalPersona.show();
});

const postClientForm = document.getElementById("create_client");
postClientForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("create form ===========");
  const formdata = new FormData(postClientForm);
  console.log(Object.fromEntries(formdata));
});

const putClientForm = document.getElementById("edit_client");
putClientForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formdata = new FormData(putClientForm);
  console.log("edit form ===========");
  console.log(Object.fromEntries(formdata));
});
