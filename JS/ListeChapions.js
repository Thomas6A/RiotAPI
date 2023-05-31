document.addEventListener("DOMContentLoaded", async function () {
  dernierChampion = 0;
  let plus = document.getElementById("plus");

  await fetch(
    "http://ddragon.leagueoflegends.com/cdn/13.10.1/data/fr_FR/champion.json",
    "GET",
    printChampion
  );

  function fetch(url, method, fun) {
    const request = new XMLHttpRequest();
    request.addEventListener("load", fun);
    request.open(method, url);
    request.setRequestHeader("Accept", "application/json");
    request.send();
  }

  function printChampion() {
    let result = JSON.parse(this.response);
    const limite = 6;
    let fin_index = dernierChampion + limite;
    let champions = Object.values(result.data);
    if (fin_index > champions.length) {
      fin_index = champions.length;
    }
    for (let i = dernierChampion; i < fin_index; i++) {
      let champion = champions[i];
      console.log(champion);
      let li = document.createElement("li");
      let link = document.createElement("a");
      link.href = "#";
      let img = document.createElement("img");
      img.src = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`;
      link.append(img);
      let span = document.createElement("span");
      span.innerHTML += champion.name;
      link.append(span);
      //   link.addEventListener("click", function () {
      //     detailPokemon(result.pokemon_species[i].name);
      //   });
      li.append(link);
      document.getElementById("jokes").append(li);
    }
    dernierChampion = fin_index;
  }

  plus.addEventListener("click", function () {
    fetch(
      "http://ddragon.leagueoflegends.com/cdn/13.10.1/data/fr_FR/champion.json",
      "GET",
      printChampion
    );
  });
});
