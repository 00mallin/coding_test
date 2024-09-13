async function main() {
    document.body.style.backgroundImage = `url('https://sun.dise.com/disejackpot/error.jpg')`;

    try {
        const response = await fetch('https://sun.dise.com/disejackpot/API/');

        if (response.ok) { // Successful response from API
            try {
                const data = await response.json();
                if ("DISEGAME" in data && data["DISEGAME"].length > 0) { // Verify response
                    const gameData = data["DISEGAME"][0];
                    setData(gameData);
                } else {
                    console.log("Invalid response");
                }
            } catch (error) {
                console.log("Failed to parse JSON:", error);
            }
        } else {
            console.log("Failed to fetch data. Status code:", response.status);
        }
    } catch (error) {
        console.log("An error occurred while making the request:", error);
    }
}

function setData(data) {
    const jackpotAmount = data['JackpotAmount'];
    const drawDate = data['DrawDate'];
    const validDrawDate = verifyDate(drawDate);
    if (!validDrawDate) {
        return;
    }

    if (jackpotAmount < 25000000 && jackpotAmount > 10000000) {
        setBallNumbers(jackpotAmount);
        document.body.style.backgroundImage = `url('https://sun.dise.com/disejackpot/background1.jpg')`;
    } else if (jackpotAmount >= 25000000 && jackpotAmount < 30000000) {
        setBallNumbers(jackpotAmount);
        document.body.style.backgroundImage = `url('https://sun.dise.com/disejackpot/background2.jpg')`;
        if (jackpotAmount >= 27000000) {
            const confetti = document.querySelector('#videoConfetti');
            confetti.style.display = 'block';
        }
    } else { // Invalid jackpot. Hide goldenNumber and date
        const img = document.querySelector("#goldenNumber")
        const drawDate = document.querySelector("#drawDate")
        img.src = ''
        drawDate.innerText = ''
        console.log(`JackpotAmount out of range ${jackpotAmount}`);
    }
}

function setBallNumbers(number) {
    const roundedNumber = Math.round(number / 1000000);
    const img = document.querySelector("#goldenNumber")
    img.src = `https://sun.dise.com/disejackpot/info_gold_ball00${roundedNumber}.png`
}

function verifyDate(date) {
    try {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            throw new Error("Invalid date format.");
        }

        // Verify that the date is not from before today
        const today = new Date();
        if (dateObj < today) {
            console.log("The date is from before today.");
            return false;
        } else {
            const formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
            const drawDate = document.querySelector("#drawDate")
            drawDate.innerText = formattedDate
            return true;
        }
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

main()
const intervalId = setInterval(main, 10000);