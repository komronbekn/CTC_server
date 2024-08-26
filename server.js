import fetch from 'node-fetch';

// URL вашего JSON Server
const url = 'http://localhost:5000/users';

// Интервал обновления в миллисекундах (1 секунда = 1000 мс)
const interval = 1000;

const updateCoinLimit = async () => {
    try {
        // Получить всех пользователей
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const users = await response.json();

        for (const user of users) {
            // Проверяем, есть ли maxCoinLimit и не превышен ли coinLimit
            if (user.maxCoinLimit && user.coinLimit < user.maxCoinLimit) {
                // Увеличиваем coinLimit на 1
                const updatedCoinLimit = user.coinLimit + 1;
                
                // Обновляем пользователя с новым coinLimit
                const updateResponse = await fetch(`${url}/${user.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...user, coinLimit: updatedCoinLimit }),
                });

                if (!updateResponse.ok) {
                    throw new Error('Failed to update user');
                }
            }
        }
    } catch (error) {
        console.error('Ошибка обновления coinLimit:', error.message);
    }
};

// Обновлять каждую секунду
setInterval(updateCoinLimit, interval);
