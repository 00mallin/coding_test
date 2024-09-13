import requests, json#, DISEScript
from datetime import datetime

def main():
    # Default background image
    #DISEScript.SetVariable('bgImage', 'bgError') #https://sun.dise.com/disejackpot/error.jpg
    try:
        jackpotResponse = requests.get('https://sun.dise.com/disejackpot/API/')

        if jackpotResponse.status_code == 200: # Successful response from API
            try:
                data = jackpotResponse.json()
                if "DISEGAME" in data and len(data["DISEGAME"]) > 0: # Verify response
                    data = data["DISEGAME"][0]
                    setBackground(data)
                else:
                    print("Invalid response")
            except:
                print("Failed to parse json.")
    except:
        print("An error occurred while making the request.")

def setBackground(data):
    jackpotAmount = data['JackpotAmount']
    drawDate = data['DrawDate']
    validDrawDate = verifyDate(drawDate)
    if not validDrawDate:
        return

    if jackpotAmount < 25000000 and jackpotAmount > 10000000:
        setBallNumbers(jackpotAmount)
        print("Below 25 mil")
        #DISEScript.SetVariable('bgImage', 'bg1') #https://sun.dise.com/disejackpot/background1.jpg
    elif jackpotAmount >= 25000000 and jackpotAmount < 30000000:
        setBallNumbers(jackpotAmount)
        print("Above 25 mil")
        #DISEScript.SetVariable('bgImage', 'bg2') #https://sun.dise.com/disejackpot/background2.jpg   
        if jackpotAmount >= 27000000:
            print("Play confetti!")
            #DISEScript.SetVariable('confetti', 'true')       
    else:
        print(f"JackpotAmount out of range {jackpotAmount}")

def setBallNumbers(number):
    roundedNumber = round(number / 1000000)
    imageURL = f'https://sun.dise.com/disejackpot/info_gold_ball00{roundedNumber}.png'
    print(imageURL)
    #DISEScript.SetVariable('pngUrl', f'{imageURL}')

def verifyDate(date):
    try:
        date_obj = datetime.strptime(date, "%Y-%m-%d")
    except:
        print("Invalid date format.")
        return False

    # Verify that the date is not from before today
    if date_obj < datetime.now():
        print("The date is from before today.")
        return False
    else:
        formatted_date = date_obj.strftime("%d %B %Y")
        print(f"Draw date: {formatted_date}")
        #DISEScript.SetVariable('drawDate', f'{formatted_date}')
        return True


main()
