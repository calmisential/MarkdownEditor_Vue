
Vue.filter('date', time => moment(time).format('YYYY年MM月DD日, HH:mm:ss'))


let app = new Vue({
    el: "#notebook",
    data() {
        return {
            notes: JSON.parse(localStorage.getItem('notes')) || [],
            selectedId: localStorage.getItem("selectedId") || null,
            defaultNameIndex: 0
        }
    },

    computed: {
        notePreview() {
            return this.selectedNote.content ? marked(this.selectedNote.content) : ""
        },
        addButtonTitle() {
            return '共有' + this.notes.length + '条笔记'
        },
        selectedNote() {
            return this.notes.find(note => note.id === this.selectedId)
        },
        sortedNotes() {
            return this.notes.slice()
                .sort((a, b) => a.created - b.created)
                .sort((a, b) => (a.favorite === b.favorite) ? 0 : a.favorite ? -1 : 1)
        },

        //行数统计
        linesCount() {
            if (this.selectedNote) {
                return this.selectedNote.content.split(/\r\n|\r|\n/).length
            }
        },

        //字符数统计
        charactersCount() {
            if (this.selectedNote) {
                return this.selectedNote.content.split('').length
            }
        }
    },

    created() {
        // this.content = localStorage.getItem('content') || "开始输入Markdown"
    },

    watch: {
        notes: {
            // 每当notes变化，就调用saveNotes方法
            handler: "saveNotes",
            // 侦听notes中具体属性内容的变化
            deep: true,
        },
        selectedId: {
            handler: "saveSelectedId",
        }
    },

    methods: {
        addNote() {
            this.defaultNameIndex += 1
            const time = Date.now()
            const note = {
                id: String(time),
                title: "未命名" + this.defaultNameIndex,
                content: "笔记内容",
                created: time,
                favorite: false
            }
            this.notes.push(note)
        },
        selectNote(note) {
            this.selectedId = note.id
        },
        saveNotes() {
            localStorage.setItem("notes", JSON.stringify(this.notes))
            console.log("已自动保存", new Date());
        },
        // 保存选中项
        saveSelectedId() {
            localStorage.setItem("selectedId", this.selectedId)
        },
        removeNote() {
            if (this.selectedNote && confirm("确定要删除当前笔记吗？")) {
                const index = this.notes.indexOf(this.selectedNote)
                if (index != -1) {
                    this.notes.splice(index, 1)
                }
            }
        },

        pinNote() {
            this.selectedNote.favorite = !this.selectedNote.favorite
        }
    },
})