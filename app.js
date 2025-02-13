import { getSongs } from "./api.js";

const tableBody = document.getElementById('table-body');
const errorElement = document.getElementById('error');
const input = document.getElementById('search');
const select = document.getElementById('genre');
const restricted = document.getElementById('restricted');
const playlistBtn = document.getElementById('page-playlist-btn');
const musicBtn = document.getElementById('page-music-btn');
const pagination = document.getElementById('pagination')

errorElement.style.display = 'none';

let songsList = [];
let playlist = [];
let isPlaylist = false;
let songsPerPage = 10;
let currentPage = 1;


bindEventListener();
getSongs().then((songs) => {
	console.log(songs);
	songsList = songs;
	renderTableData(songs);
	generateGenres();
});

function renderTableData(songs) {
	tableBody.innerHTML = '';

	const startIndex = (currentPage - 1) * songsPerPage;
	const endIndex = startIndex + songsPerPage;
	const slicedSongs = songs.slice(startIndex, endIndex)

	slicedSongs.forEach((song) => {
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
		actionsCell.innerHTML = isPlaylist ?
		`<button id="remove-btn-${song.id}" class="btn btn-danger">Remove from playlist</button>` :
		`<button id="add-btn-${song.id}" class="btn btn-primary">Add to playlist</button>`;

		row.append(idCell, titleCell, artistCell, albumCell, genreCell, durationCell, releaseCell, restrictedCell, actionsCell);
		tableBody.append(row);

		const isSongInPlaylist = playlist.find((playlistSong) => playlistSong.id === song.id);
		if (isSongInPlaylist && !isPlaylist) {
			const addBtn = document.getElementById(`add-btn-${song.id}`);
			addBtn.classList.add('disabled')
		}
	});

	bindRowButtonEventListeners(slicedSongs);
	generatePagination(songs);
}

function bindEventListener() {
	input.addEventListener('input', () => {
		filterSongs();
	});

	select.addEventListener('input', () => {
		filterSongs();
	});

	restricted.addEventListener('click', () => {
		filterSongs();
	});

	playlistBtn.addEventListener('click', () => {
		isPlaylist = true;
		renderTableData(playlist);
	})

	musicBtn.addEventListener('click', () => {
		isPlaylist = false;
		renderTableData(songsList);
	})
}

function filterSongs() {

	// this is filter for input
	const searchValue = input.value.trim().toLowerCase();
		let filteredSongs = isPlaylist ? [...playlist] : songsList.map(song => song);

		// filteredSongs = filteredSongs.filter((song) => {
		// 	return !playlist.find((playlistSong) => playlistSong.id === song.id)
		// })

		if (searchValue) {
			filteredSongs = filteredSongs.filter((song) => {
				return song.title.toLowerCase().includes(searchValue) || song.artist.toLowerCase().includes(searchValue) || song.album.toLowerCase().includes(searchValue);
			});
		}

	// this is filter for genre
	const genreValue = select.value;
	if(genreValue) {
		filteredSongs = filteredSongs.filter((song) => {
			if (genreValue === 'Select genre') {
				return true;
			}
			return song.genre === genreValue;
		});
	};

	// this is filter for restriction
	const restrictedValue = restricted.checked;
		filteredSongs = filteredSongs.filter((song) => {
			if (restrictedValue === true) {
				return true;
			}
			return song.restricted === 'None'
		})
	


	console.log(filteredSongs);
	renderTableData(filteredSongs);
}

function generateGenres() {
	const genres = songsList.reduce((acc, curr) => {
		if (!acc.includes(curr.genre)) {
			acc.push(curr.genre)
		}

		return acc;
	}, []);
	console.log(genres);

	const selectGenreOption = document.createElement('option');
	selectGenreOption.innerText = 'Select genre';
	select.append(selectGenreOption);

	genres.forEach((genre) => {
		const optionElement = document.createElement('option');
		optionElement.innerText = genre;
		optionElement.setAttribute('value', genre);

		select.append(optionElement);
	});
};

function bindRowButtonEventListeners(songsList) {
	if (!isPlaylist) {
		songsList.forEach((song) => {
			const addToPlaylistButton = document.getElementById(`add-btn-${song.id}`);
			addToPlaylistButton.addEventListener('click', () => {
				addSongToPlaylist(song);
			})
		})
	} else {
		songsList.forEach((song) => {
			const removeFromPlaylistButton = document.getElementById(`remove-btn-${song.id}`);
			removeFromPlaylistButton.addEventListener('click', () => {
				removeSongFromPlaylist(song);
			})
		})
	}
};

function addSongToPlaylist(song) {
	playlist.push(song);
	// console.log(playlist);
	// filterSongs();
	const addToPlaylistButton = document.getElementById(`add-btn-${song.id}`);
	addToPlaylistButton.classList.add('disabled')
}

function removeSongFromPlaylist(song) {
	playlist = playlist.filter((playlistSong) => {
		return playlistSong.id !== song.id;
	});

	renderTableData(playlist);
}

function generatePagination(songs) {
	const totalPages = Math.ceil(songs.length / songsPerPage);

	pagination.innerHTML = '';

	for (let i = 1; i <= totalPages; i++) {
		const li = document.createElement('li');
		li.innerHTML = `<a class="page-link ${i === 1 ? 'active' : ''}" id="page-link-${i}" href="#">${i}</a>`;
		pagination.append(li);

		li.addEventListener('click', () => {
			const activeElement = document.getElementsByClassName('page-link active');
			if (activeElement) {
				activeElement[0].classList.remove('active')
			}
			currentPage = i;
			renderTableData(songs);


			document.getElementById(`page-link-${i}`).classList.add('active');
		});
	}
}