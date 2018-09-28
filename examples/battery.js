// Battery
// returns a promise with battery instance

// charging: false
// chargingTime: Infinity
// dischargingTime: 1980
// level: 0.12
// onchargingchange: null
// onchargingtimechange: null
// ondischargingtimechange: null
// onlevelchange: null

//print battery info
navigator.getBattery().then((batteryInstance) => {
  console.log(batteryInstance)
});

