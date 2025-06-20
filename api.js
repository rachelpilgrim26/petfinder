// let apiKey = "lU10kKiJGPVtC2DPeV1OjbwsoI6EIW62mLwl81j3jcKWJizgZL";
// let secret = "GweNg2wRUCqnxdB7rIC4hHRQbODXSsnOQBOGGO5T";

let form = document.querySelector("#petForm");
form.addEventListener("submit", onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  const dataObject = Object.fromEntries(data.entries());
  console.log("dataObject", dataObject);

  form.reset();

  getAdoptablePets(dataObject);
}

function getToken() {
  return fetch("https://api.petfinder.com/v2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "lU10kKiJGPVtC2DPeV1OjbwsoI6EIW62mLwl81j3jcKWJizgZL",
      client_secret: "GweNg2wRUCqnxdB7rIC4hHRQbODXSsnOQBOGGO5T",
    }),
  })
    .then((res) => res.json())
    .then((data) => data.access_token);
}

function getAdoptablePets(formData) {
  const type = formData.type;
  //tried input
  const zip = formData.zip;

  //first need to call the getToken function, then once that value is returned, you can use the token in the API call
  //they will have to research how to build their link
  getToken().then((token) => {
    fetch(
      `https://api.petfinder.com/v2/animals?type=${formData.type}&location=${formData.zip}`,
      {
        //note the token is being used in the header, which they will learn more about in backend
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())

      .then((data) => {
        console.log(JSON.stringify(data, null, 2));
        //aj helped me with these i dont understand it
        showPets(data.animals);
      });
  });
}

function showPets(petData) {
  const results = document.getElementById("results");
  results.innerHTML = "";
  // clear previous results if not they will just keep showing

  petData.forEach((pet) => {
    const petCard = document.createElement("div");
    petCard.classList.add("pet-card");

    petCard.innerHTML = `
      <img src="${
        pet.photos[0]?.medium || "https://via.placeholder.com/150"
      }" alt="${pet.name}" />
      //had to get help from chatgpt on this ii still dont understand it but i am gonna look into it 
      <h3>${pet.name}</h3>
      <p>Breed: ${pet.breeds.primary || "Unknown"}</p>
      //this too got help from chatgpt 
      <p>Age: ${pet.age}</p>
      <p>Gender: ${pet.gender}</p>
    `;

    results.appendChild(petCard);
  });
}
