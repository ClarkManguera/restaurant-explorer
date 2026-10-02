async function loadRestaurants() {
    const borough =
        document.getElementById("borough").value;

    const cuisine =
        document.getElementById("cuisine").value;

    const grade =
        document.getElementById("grade").value;

    const maxScore =
        document.getElementById("maxScore").value;

    const params =
        new URLSearchParams();

    if (borough) {
        params.append(
            "borough",
            borough
        );
    }

    if (cuisine) {
        params.append(
            "cuisine",
            cuisine
        );
    }

    if (grade) {
        params.append(
            "grade",
            grade
        );
    }

    if (maxScore) {
        params.append(
            "maxScore",
            maxScore
        );
    }

    const response =
        await fetch(
            `/api/restaurants?${params}`
        );

    const restaurants =
        await response.json();

    displayRestaurants(restaurants);
}

function displayRestaurants(restaurants) {
    const results =
        document.getElementById("results");

    results.innerHTML = "";

    restaurants.forEach(restaurant => {
        const card =
            document.createElement("div");

        card.innerHTML = `
            <h2>${restaurant.name}</h2>

            <p>
                Borough:
                ${restaurant.borough}
            </p>

            <p>
                Cuisine:
                ${restaurant.cuisine}
            </p>

            <p>
                Grade:
                ${restaurant.grade || "N/A"}
            </p>

            <p>
                Score:
                ${restaurant.score ?? "N/A"}
            </p>
        `;

        results.appendChild(card);
    });
}