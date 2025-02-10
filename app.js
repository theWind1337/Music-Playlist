import { getSongs } from "./api.js"

// console.log(works)

getSongs().then((songs) => {
	console.log(songs)
})