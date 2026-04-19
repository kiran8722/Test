const form = document.getElementById('userForm');
const statusMessage = document.getElementById('statusMessage');
const saveBtn = document.getElementById('saveBtn');

function showStatus(type, message) {
    statusMessage.className = `status ${type}`;
    statusMessage.textContent = message;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim()
    };

    if (!payload.name || !payload.email) {
        return showStatus('error', 'Name and Email are required.');
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    showStatus('loading', 'Saving data...');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
        const response = await fetch('https://personal-cnt5ftwz.outsystemscloud.com/SaveAPI/rest/GetInfo/CreateInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'SecretKey': '123456'
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeout);

        const result = await response.json();

        if (response.ok && (result.Success || result.success)) {
            showStatus('success', result.Message || result.message || 'Saved successfully!');
            form.reset();
        } else {
            showStatus('error', result.Message || result.message || 'Failed to save data.');
        }
    } catch (error) {
        clearTimeout(timeout);
        showStatus('error', error.name === 'AbortError' ? 'Request timed out.' : 'Network error.');
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Data';
    }
});