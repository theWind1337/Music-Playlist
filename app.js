import { getSongs } from "./api.js";

const tableBody = document.getElementById('table-body');
const errorElement = document.getElementById('error');
const input = document.getElementById('search');

errorElement.style.display = 'none';

let songsList = [];


bindEventListener();
getSongs().then((songs) => {
	console.log(songs);
	songsList = songs;
	renderTableData(songs);
});

function renderTableData(songs) {
	tableBody.innerHTML = '';

	songs.forEach((song) => {
		const row = document.createElement('tr');

		const idCell = document.createElement('td');
		idCell.innerText = song.id;

		const titleCell = document.createElement('td');
		titleCell.innerText = song.title;

		const artistCell = document.createElement('td');
		artistCell.innerText = song.artist;

		const albumCell = document.createElement('td');
		albumCell.innerText = song.album;

		const genreCell = document.createElement('td');
		genreCell.innerText = song.genre;

		const durationCell = document.createElement('td');
		durationCell.innerText = song.duration;

		const releaseCell = document.createElement('td');
		releaseCell.innerText = song.releaseDate;

		const restrictedCell = document.createElement('td');
		restrictedCell.innerText = song.restricted;

		const actionsCell = document.createElement('td');
		actionsCell.innerHTML = `<button id="add-btn-${song.id}" class="btn btn-primary">Add to playlist</button>`;

		row.append(idCell, titleCell, artistCell, albumCell, genreCell, durationCell, releaseCell, restrictedCell, actionsCell);
		tableBody.append(row);
	})
}

function bindEventListener() {
	input.addEventListener('input', () => {
		filterSongs();
	})
}

function filterSongs() {
	const searchValue = input.value.trim().toLowerCase();

	const filteredSongs = songsList.filter((song) => {
		return song.title.toLowerCase().includes(searchValue) || song.artist.toLowerCase().includes(searchValue) || song.album.toLowerCase().includes(searchValue);
	});
	console.log(filteredSongs);
	renderTableData(filteredSongs);
}