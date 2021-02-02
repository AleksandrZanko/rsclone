/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-use-before-define */
import '../css/style.css';

// Количество жизней игрока
let lifes = 3;

// Уровень
let level = 1;

let bulletClass;

// Количество выстрелов
let shots = 0;

// Имя пользователя
let user;

// Громкость
let volume = 0.5;

// Сложность
let complexity = 10;


// Проигрывание музыки
function playSound(url, volumeValue) {
	const object = new Audio(url)
	object.volume = volumeValue;
	object.play();
}

// Музыка уровней
const round = new Audio('../sound/mortik.mp3');

// Создание пули 
function createBullet(bulletClassName) {
	const gameField = document.querySelector('.game-field');
	const bullet = document.createElement('div');
	const player = document.querySelector('#player');

	bullet.className = bulletClassName;
	bullet.style.left = `${player.offsetLeft + player.offsetWidth}px`;
	
	if(document.documentElement.clientWidth > 812) {
		bullet.style.top = `${player.offsetTop + 85 }px`;
		
	} else {
		bullet.style.top = `${player.offsetTop + 25 }px`;
	}
	gameField.appendChild(bullet);

	// Движение пули
	bulletMove(bullet);	
} 

// Движение пули
function bulletMove(bullet) {
	
	// Движение пули
	const timerId = setInterval(() => {
			bullet.style.left = `${bullet.offsetLeft + 10 }px`;

			// Проверка попадания пули
			isShot(bullet, timerId);
			// Удаление улетевшей пули	
			if (bullet.offsetLeft > document.body.clientWidth) {
				bullet.remove();
				clearInterval(timerId);
			}
		}, 10);	
}

// Проверка попадания в мишень
function isShot(bullet, timer) {
	// Координаты пули
	const topB = bullet.offsetTop;
	const bottomB = bullet.offsetTop + bullet.offsetHeight;
	const leftB = bullet.offsetLeft;
	
	const enemy = document.querySelector(".enemy");
	if(enemy != null) {
		// Координаты врага
		const topE = enemy.offsetTop;
		const bottomE = enemy.offsetTop + enemy.offsetHeight;
		const leftE = enemy.offsetLeft;

		if(bottomB >= topE && topB <= bottomE && leftB >= leftE) {	
			playSound('../sound/boom.mp3', volume);
			enemy.className = 'boom';
			enemy.style.top = `${topE - 50  }px`;
			enemy.style.left = `${leftE - 50  }px`;
			clearInterval(enemy.dataset.timer);
			setTimeout(() => {
					enemy.remove();
					clearInterval(timer);
					bullet.remove();
					createEnemy(level, complexity);
					minusHeath();
				}, 100)
		}
	}	
}

// Попадание в игрока
function isDie() {
	const enemy = document.querySelector('#enemy');
	const player = document.querySelector('#player');
	if(level < 4) {
		if(enemy.offsetTop + enemy.offsetHeight > player.offsetTop && 
			enemy.offsetTop < player.offsetTop + player.offsetHeight &&
			enemy.offsetLeft <= player.offsetLeft + player.offsetWidth) {
			playSound('../sound/boom.mp3', volume);
			enemy.className = 'boom';
		enemy.style.top = `${player.offsetTop + 50  }px`;
		enemy.style.left = `${player.offsetLeft + 50  }px`;
		clearInterval(enemy.dataset.timer);
			setTimeout(() => {
					enemy.remove();
					createEnemy(level, complexity);
				}, 50);
			die();
		}
	}
}


// Получить случайное число 
function random(min, max) {
  // случайное число от min до (max+1)
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

// Создание врага
function createEnemy(levelValue, speed) {
	const gameField = document.querySelector('.game-field');
	const enemy = document.createElement('div');
	
	enemy.id = 'enemy';
	enemy.className = 'enemy';
	enemy.classList.add(`enemy${levelValue}`);
	gameField.appendChild(enemy);
	enemy.style.top = `${random(100, document.body.offsetHeight - enemy.offsetHeight)  }px`;

	const timerId = setInterval(() => {
			enemy.style.left = `${enemy.offsetLeft - speed}px`;
			if (enemy.offsetLeft + enemy.offsetWidth < 0) {
				enemy.remove();
				clearInterval(timerId);
				createEnemy(level, complexity);
				// Отнимаем жизнь
				die();
			}
			isDie();
		}, 100);

	enemy.dataset.timer = timerId;	
}

// Проигрыш
function endGame() {
	document.body.innerHTML = '';
	round.pause();
	round.currentTime = 0;

	playSound('../sound/lose.mp3', volume);

	const loseWrapper = document.createElement('div');
	const loseTitle = document.createElement('h1');

	loseWrapper.className = 'lose-wrapper';
	loseTitle.className = 'lose-title';

	loseTitle.innerHTML = 'Ну вот и всё... Марс захватили злые силы';

	document.body.appendChild(loseWrapper);
	loseWrapper.appendChild(loseTitle);
	setTimeout(() => location.reload(), 5000) ;
}

// Отнимаем жизнь
function die() {
	lifes -= 1;
	if(lifes !== 0) {
		const lifesBlock = document.querySelector("#lifes");
		const life = lifesBlock.querySelector('span');
		life.remove();
	} else {
		endGame();
	}
}

// Создание панели здоровья
function createEnemyHealth() {
	const gameField = document.querySelector('.game-field');
	const healthScale = document.createElement('progress');
	healthScale.className = 'enemy-health';
	healthScale.value = 100;
	healthScale.max = 100;
	gameField.appendChild(healthScale);
}

// Отнять здоровье у противника при попадании
function minusHeath() {
	const healthBar = document.querySelector('.enemy-health');
	healthBar.value -= 10;

	if(healthBar.value === 0) {
			level += 1;
			nextLevelIntro();	
	}
}

// Создание счётчика выстрелов
function createShotsCounter() {
	const gameField = document.querySelector('.game-field');
	const counterWrapper = document.createElement('div');
	const counterText = document.createElement('span');
	const counterNumber = document.createElement('span');
	shots = 0;

	counterWrapper.className = 'counter-wrapper';
	counterText.className = 'counter-text';
	counterNumber.className = 'counter-number';

	counterText.innerHTML = 'Выстрелы';
	counterNumber.innerHTML = shots;

	gameField.appendChild(counterWrapper);
	counterWrapper.appendChild(counterText);
	counterWrapper.appendChild(counterNumber);
}

// Добавление значения счётчика при выстреле
function shotsCounterPlus() {
	const counterNumber = document.querySelector('.counter-number');
	shots += 1;
	counterNumber.innerHTML = shots;
}

// Создание блока информации о уровне и времени
function createGameInfo() {
	const gameField = document.querySelector('.game-field');
	const infoWrapper = document.createElement('div');
	const infoLevel = document.createElement('span');
	const infoTime = document.createElement('span');

	infoWrapper.className = 'info-wrapper';
	infoLevel.className = 'info-level';
	infoTime.className = 'info-time';

	infoLevel.innerText = 'Уровень: 1/3';
	infoTime.innerText = 'Время: 0 сек.';
	
	gameField.appendChild(infoWrapper);
	infoWrapper.appendChild(infoLevel);
	infoWrapper.appendChild(infoTime);
}

// Смена уровня
function gameInfoLevelChange() {
	const infoLevel = document.querySelector('.info-level');
	infoLevel.innerText = `Уровень: ${level}/3`;
}

// Время игры
function gameTime() {
	const infoTime = document.querySelector('.info-time');
	let sec = 0;
	return () => {
		sec += 1;
		infoTime.innerText = `Время: ${sec} сек.`;
	}	
}

// Сохраняем результат 
function saveResult() {
		let shotsResult = document.querySelector('.counter-number');
		let time = document.querySelector('.info-time');
		shotsResult = shotsResult.textContent;
		time = time.textContent.substr(7).slice(0, -5);
		

		const obj = {};
		obj.id = random(0, 1000);
		obj.name = user;
		obj.shots = shotsResult;
		obj.time = time;
		localStorage.setItem(`winner ${obj.id}`, JSON.stringify(obj));
}

// Переход на новый уровень. Создаем интро. 
function nextLevelIntro() {
	round.pause();
	round.currentTime = 0;
	if(level < 4) {
		playSound('../sound/level.mp3', volume);
		const body = document.querySelector('body');
		const congratulationWrapper = document.createElement('div');
		const congratulationText = document.createElement('h1');

		congratulationWrapper.className = 'level-change';
		congratulationText.innerHTML = `Поздравляем, ${user}! Вы перешли на ${level} Уровень!`;

		congratulationWrapper.appendChild(congratulationText);
		body.appendChild(congratulationWrapper);

		setTimeout(createNewLevel, 5000);
	} else {
		saveResult();
		document.body.innerHTML = '';
		playSound('../sound/win.mp3', volume);

		const win = document.createElement('div');
		const winText = document.createElement('h1');
		const winCupWrapper = document.createElement('div');
		const winCup = document.createElement('img');
		const winnerName = document.createElement('span');
		const winButton = document.createElement('button');

		win.className = 'win';
		winText.className = 'win-text';
		winCupWrapper.className = 'win-img-wrapper'; 
		winCup.className = 'win-img';
		winCup.src = '../img/win.png';
		winnerName.className = 'win-name';
		winButton.className = 'win-button';
		
		winText.innerHTML = 'Вы победили!';
		winButton.innerHTML = 'Ура!';
		winnerName.innerHTML = user;

		document.body.appendChild(win);
		win.appendChild(winText);
		win.appendChild(winCupWrapper);
		winCupWrapper.appendChild(winCup);
		winCupWrapper.appendChild(winnerName);
		win.appendChild(winButton);
	
		winButton.addEventListener('click', () => {
				location.reload();
			})
	}
}

// Удаляем старый и создаём новый уровень
function createNewLevel() {
	round.play();
	round.volume = volume;
	const congratulationWrapper = document.querySelector('.level-change');
	const healthScale = document.querySelector('.enemy-health');
	const gameField = document.querySelector('.game-field');
	const enemy = document.querySelector('.enemy');

	congratulationWrapper.remove();
	healthScale.remove();
  enemy.remove();

  gameInfoLevelChange();
	createEnemyHealth();
	gameField.style.backgroundImage = `url(../img/bg${level}.jpg)`;
	createEnemy(level, complexity);
}


// Меню
const menu = document.querySelector('.menu');

const newGameBtn = document.querySelector('.new-game');
const controlBtn = document.querySelector('.control-btn');
const settingsBtn = document.querySelector('.settings-btn');
const hallBtn = document.querySelector('.hall-of-frame-btn');


// Нажатие на кнопку новая игра
newGameBtn.addEventListener('click', () => {
		const popup = document.querySelector('.popup');
		const popupButton = document.querySelector('.popup-button');
		const name = document.querySelector('.name');

		const intro = document.querySelector('.intro');
		const backToMenuBtn = intro.querySelector('.back-to-menu-button');
		const overlay = document.querySelector('.overlay');

		menu.classList.add('menu--close');
		popup.classList.add('popup--active');
		overlay.classList.add('active');
		name.focus();
		popup.addEventListener('keydown', (event) => {
			if (event.keyCode === 27) {
				popup.classList.remove('popup--active');
				overlay.classList.remove('active');
				menu.classList.remove('menu--close');
			}
		});

		popupButton.addEventListener('click', () => {		
			if (name.value.length > 0 && name.value.length <= 10) {
				name.style.borderColor = 'black';
				popup.classList.remove('popup--active');
				intro.classList.add('active');
				user = name.value;
				overlay.classList.remove('active');
			} else {
				name.classList.add('error');
				setTimeout(() => {
					name.classList.remove('error');
					name.focus();
				}, 700);
			}
		});

		backToMenuBtn.addEventListener('click', () => {
			menu.classList.remove('menu--close');
			intro.classList.remove('active');
		});
	})

// Управление в игре 
function gameControl() {
	const player = document.querySelector('#player');

// Добавляем события нажатия клавиш
	document.addEventListener('keydown', (event) => {
			// Нажатие вниз
			if (event.keyCode === 40 && player.offsetTop + 10 < document.documentElement.clientHeight - player.offsetHeight) {
				player.style.top = `${player.offsetTop + 10  }px`;
			}

			// Нажатие вверх
			if (event.keyCode === 38 && player.offsetTop - 10 > 0) {
				player.style.top = `${player.offsetTop - 10  }px`;
			}

			// Нажали вправо
			if (event.keyCode === 39 && player.offsetLeft + player.offsetWidth < document.documentElement.clientWidth) {
				player.style.left = `${player.offsetLeft + 10  }px`;
			}

			// Нажатие влево
			if (event.keyCode === 37 && player.offsetLeft - 5 > 0) {
				player.style.left = `${player.offsetLeft - 10  }px`;
			}

			if (event.keyCode === 32) {
				playSound('../sound/shot.mp3', volume);
				createBullet(bulletClass);
				shotsCounterPlus();
			}
		})
} 

// Управление на мобильных устройствах
function touchEvent() {
	const gameField = document.querySelector('.game-field');
	const player = document.querySelector('#player');

	gameField.addEventListener('touchstart', (event) => {
			if (event.touches[0].clientX > document.body.clientWidth * 0.5) {
				playSound('../sound/shot.mp3', volume);
				createBullet(bulletClass);
				shotsCounterPlus();
			}

			if (event.touches[0].clientY <= player.offsetTop && event.touches[0].clientX <= player.offsetWidth) {
				player.style.top = `${event.touches[0].clientY}px`;
			}

			if (event.touches[0].clientY >= player.offsetTop + player.offsetHeight && event.touches[0].clientX <= player.offsetWidth) {
				player.style.top = `${event.touches[0].clientY - player.offsetHeight}px`;
			}
		})
}

// Создание игрока и игры
function createPlayer(playerClass, bullet) {
	round.play();
	round.volume = volume;
	const gameField = document.querySelector('.game-field');
	const intro = document.querySelector('.intro');
	const player = document.querySelector('#player');

	intro.classList.remove('active');
	gameField.classList.add('game-field--active');

	player.classList.add(playerClass);

	gameControl();
	touchEvent();
	createGameInfo();
	createShotsCounter();
	createEnemyHealth();
	createEnemy(level, complexity);
	bulletClass = bullet;
	const timeRun = gameTime();
	setInterval(timeRun, 1000);
}

// Выбор игрока
function selectPlayer() {
	const intro = document.querySelector('.intro');
	const singer = intro.querySelector('.singer');
	const grandmom = intro.querySelector('.grandmom');
	const girl = intro.querySelector('.girl');
	const worker = intro.querySelector('.worker');
	singer.addEventListener('click', () => {
			createPlayer('player-singer', 'bullet-singer');
		})

	grandmom.addEventListener('click', () => {
			createPlayer('player-grandmom', 'bullet-grandmom');
		})

	girl.addEventListener('click', () => {
			createPlayer('player-girl', 'bullet-girl');
		})

	worker.addEventListener('click', () => {
			createPlayer('player-worker', 'bullet-worker');
		})
}
selectPlayer();	


// Закрытие и открытие пункта меню
function closeMenu(point) {
	const currentPoint = document.querySelector(point);
	const backToMenuBtn = currentPoint.querySelector('.back-to-menu-button');
	menu.classList.add('menu--close');
	currentPoint.classList.add('active');

	backToMenuBtn.addEventListener('click', () => {
			menu.classList.remove('menu--close');
			currentPoint.classList.remove('active');
		})
}

// Нажатие на кнопку управления
controlBtn.addEventListener('click', () => {
		closeMenu('.control');
	})

// Нажатие на кнопку настроек
settingsBtn.addEventListener('click', () => {
		closeMenu('.settings');
	})


// Нажатие на кнопку победителей
hallBtn.addEventListener('click', () => {
		closeMenu('.hall-of-frame');
		createHallOfFrame();
	})


// Берём значение звука 
function getVolume() {
	const volumeInput = document.getElementById('volume');
	volumeInput.addEventListener('click', () => {
			volume = Number(volumeInput.value);
		})
}
getVolume();

// Берём значение сложности
function getComplexity() {
	const complexityInput = document.getElementById('сomplexity');
	complexityInput.addEventListener('click', () => {
			complexity = Number(complexityInput.value);
		})
}
getComplexity();

// Создание доски почёта
function createHallOfFrame() {
	
	const arr = createResultsArr();
	appendResultInHTML(arr)
} 

// Создание массива результатов для доски почёта
function createResultsArr() {
	let winKeys = [];
	const items = {...localStorage};
	const keys = Object.keys(items);
	for(const key of keys) {
		if(key.indexOf('winner') >= 0) {
			winKeys.push(JSON.parse(localStorage.getItem(key)));
		}
	}
	
	winKeys = winKeys.slice(0, 10);
	winKeys.sort((a, b) => a.time - b.time);
	
	const resultsArr = [];
	for (const item of winKeys) {
		resultsArr.push(`${item.name}. Выстрелы: ${item.shots}. Время: ${item.time} сек.`);
	}

	return resultsArr;
}

// Удаление доски почёта
function removeHallOfFrame() {
	const elements = document.getElementsByClassName("winner-list");
	while (elements[0]) {
		elements[0].parentNode.removeChild(elements[0]);
	}
}

// Добавление результатов на страницу
function appendResultInHTML(resultsArr) {
	const hallOfFrame = document.querySelector('.hall-of-frame');
	removeHallOfFrame();

	const winnerTable = document.createElement('ol');
	winnerTable.className = 'winner-list';

	resultsArr.forEach((item) => {
		const winnerItem = document.createElement('li');
		winnerItem.innerHTML = item;
		winnerTable.appendChild(winnerItem);
	});
	hallOfFrame.appendChild(winnerTable);
}