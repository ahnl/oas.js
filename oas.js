window._oas = {
    alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').sort() ,
    generatedUIDs: []
}
class Oas {
    constructor(selector, options) {
        this.options = Object.assign({
            minDataRows: 4,
            sectionLength: 10,
            readOnly: false
        }, options);
        this.selector = selector;
        this.elements = document.querySelectorAll(selector);
        this.render();
    }

    /**
     * Generated unique UID and checks for collisions
     * This sort of thing is probably too far-fetched 😅
     */
    generateUIDWithCollisionChecking() {
        while (true) {
            let uid = 'oas-' + ("0000" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36)).slice(-4);
            if (!window._oas.generatedUIDs.includes(uid)) {
                window._oas.generatedUIDs.push(uid);
                return uid;
            }
        }
    }

    /**
     * Check whether answers string is in valid format
     * @param {String} answers - Answers string
     */
    isValidAnswerString(answers) {
        return new RegExp('^[' + window._oas.alphabet.join('') + '\.]+$').test(answers);
    }

    /**
     * Add padding of remaining section free space to the answer strings 
     * @param {String} answers - Answers string
     */
    addAnswerStringPadding(answers) {
        let modulus = answers.length % this.options.sectionLength;
        if (modulus == 0) {
            return answers;
        } else {
            return answers + ".".repeat(this.options.sectionLength - modulus);
        }
    }

    /**
     * Set the state of readOnly
     */
    set readOnly(state) {
        this.options.readOnly = state;
        this.render();
    }

    /**
     * Render answers
     */
    render() {
        // loop through all elements in the given selector
        this.elements.forEach((el) => {
            // find answer string, format it, check if it's valid, and use it
            let answers = el.dataset.answers || el.innerHTML;
            answers = this.addAnswerStringPadding(answers.trim().toUpperCase().replace(/ /g, ''));
            if (!this.isValidAnswerString(answers)) {
                console.error('Answer string not valid ' + answers)
                return;
            }
            el.dataset.answers = answers;
           
            // start from empty surface
            el.innerHTML = '';
            el.classList.remove('oas__readonly');
            if (this.options.readOnly) {
                el.classList.add('oas__readonly');
            }
            // count how many data rows we need
            let maxOption = answers.split('').sort().pop();
            let dataRowAmount = window._oas.alphabet.indexOf(maxOption) + 1;
            dataRowAmount = Math.max(dataRowAmount, this.options.minDataRows);
            
            // divide answer string into sections and render them
            for (let i = 0; i < answers.length; i += this.options.sectionLength) {
                let answersChunk = answers.slice(i,i+this.options.sectionLength);
                this.renderSection(el, answersChunk, i, dataRowAmount);
            }
            el.classList.add('oas__rendered');
        });
    }

    /**
     * Render given answer string (or given chunk of it) and append it to given element
     * @param {HTMLElement} el - Target element
     * @param {String} answers - Answer string
     * @param {Integer} sectionIndex - Current section index * sectionLength
     */
    renderSection(el, answers, sectionIndex, dataRowAmount) {
        if (!el.attributes.name) {
            el.setAttribute('name', this.generateUIDWithCollisionChecking());
        }
        let table = document.createElement('table');
        table.style.borderCollapse = "collapse";
        table.dataset.sectionIndex = sectionIndex;

        // create table head - indexes 1 2 3 4 5 6 etc.
        let tableHead = document.createElement('thead');
        let headRow = document.createElement('tr');;
        for (let i = 0; i < answers.length; i++) {
            let headCell = document.createElement('th');
            headCell.innerHTML = i + 1 + sectionIndex;
            headRow.appendChild(headCell);
        }
        tableHead.appendChild(headRow);

        // create table body
        let tableBody  = document.createElement('tbody');
        for (let i = 0; i < dataRowAmount; i++) {
            let bodyRow  = document.createElement('tr');
            for (let j = 0; j < answers.length; j++) {
                let bodyCell = document.createElement('td');
                let radioButton = document.createElement('input');
                radioButton.type = 'radio';
                radioButton.value = window._oas.alphabet[i];
                radioButton.name = 'oas__' + el.attributes.name.value + '_' + sectionIndex + '_' + j;    
                if (answers[j] == window._oas.alphabet[i]) {
                    radioButton.checked = true;
                }
                if (!this.options.readOnly) {
                    radioButton.onmouseup = this.changeEvent;    
                    radioButton.oncontextmenu = () => {return false};
                } else {
                    radioButton.disabled = true;
                }
                bodyCell.appendChild(radioButton);
                bodyRow.appendChild(bodyCell);
            }
            tableBody.appendChild(bodyRow);
        }

        // finishing touches
        table.appendChild(tableHead);
        table.appendChild(tableBody);
        
        el.appendChild(table);
    }
    
    /**
     * This method is fired up on radio button change
     * It updates the parent container answer string
     * @param {Event} event 
     */
    changeEvent(event) {
        let parent = event.target.closest('.oas__rendered');
        let answers = parent.dataset.answers.split('');
        let sectionIndex = parseInt(event.target.closest('table').dataset.sectionIndex);
        let char = event.target.value[0];

        // remove check by rightclicking it
        if (event.which == 3) {
            char = '.';
            event.target.checked = false;
        }

        // insert modified char and set new answer string
        answers[sectionIndex + event.target.parentNode.cellIndex] = char;
        parent.dataset.answers = answers.join('');
    }
}