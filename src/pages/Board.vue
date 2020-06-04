<template>
  <v-container>
    <draggable 
      id="board"
      class="row pa-4"
      v-model="columns"
      group="columns"
      ghost-class="ghost"
      draggable=".isDraggable"
      :delay="200"
      :delay-on-touch-only="true"
    >
      <div 
        class="cardColumm mr-3 isDraggable widthColumn"
        v-for="(column, indexColumn) in columns"
        :key="indexColumn"
      >
        <v-card-text class="mb-0 cardColummHeader hoverGrab">
          <p class="title mb-0">{{ column.name }}</p>
        </v-card-text>
          <draggable
            v-model="column.cards"
            group="cards"
            @start="drag=true"
            @end="drag=false"
            :list="column.cards"
            ghost-class="ghost"
            class="v-card__text minHeight scrollBar cardColummContent"
            :id="'idColumn' + column.id"
            :delay="200"
            :delay-on-touch-only="true"
          >
            <v-flex
              v-for="(card) in column.cards" 
              :key="card.id" 
            >
              <v-card
                class="mb-2 hoverGrab"
                @mouseover="card.hover = true"
                @mouseleave="card.hover = false"
                
                v-if="!card.editable"
                tile
              >
                <v-card-title>
                   <v-btn
                      text
                      class="pa-0"
                    >
                      {{ card.name }}
                    </v-btn>
                  <v-spacer></v-spacer>

                  <v-btn
                    icon
                    v-if="card.hover"
                    @click="onShowTask(card)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  
                </v-card-title>
                <v-card-text>
                  <div class="text-truncate" v-if="card.description">{{ card.description }}</div>
                </v-card-text>
              </v-card>
              <v-layout v-else justify-space-between class="mb-2">
                <v-text-field
                  placeholder="Insira o titulo"
                  solo
                  v-model="card.name"
                  v-on:keyup.enter="onAddConfirmCard(column)"
                  :ref="'inputAddCard' + column.id"
                  v-on:blur="onAddConfirmCard(column)"
                ></v-text-field>
              </v-layout>
            </v-flex>
            
          </draggable>

          <v-card-actions class="pa-3" v-if="!column.isAddingCard">
            <v-btn 
              block 
              @click="addCard(column)"
              depressed
              outlined
            >
              <v-icon>mdi-plus</v-icon> Adicionar card
            </v-btn>
          </v-card-actions>


          <v-card-actions class="pa-3" v-else>
            <v-btn 
              color="success" 
              block 
              @click="onAddConfirmCard(column)"
              depressed
            >
              <v-icon>mdi-plus</v-icon> Adicionar</v-btn>
          </v-card-actions>
      </div>


      <v-btn
        @click="addColumn" 
        v-if="!isAddingColumn"
        class="cardColumm widthColumn"
      >
        <v-icon>mdi-add</v-icon> Adicionar coluna
      </v-btn>

      <span 
        class="pa-0 widthColumn"
      >
        <v-text-field
          v-show="isAddingColumn"
          placeholder="Insira o titulo"
          solo
          v-model="nameColumn"
          append-icon="mdi-plus"
          @click:append="confirmAddColumn"
          class="pa-0 ma-0"
          v-on:keyup.enter="confirmAddColumn"
          ref="inputAddColumn"
        ></v-text-field>
      </span>
    </draggable>





    <v-dialog v-model="dialogShowTask" persistent max-width="1000px">
      <v-card>
        <div v-if="Object.keys(selectedTaskShow).length > 0">
          <v-card-title>
            <span class="headline">{{ selectedTaskShow.name ? selectedTaskShow.name : "Sem título" }}</span>
          </v-card-title>
          <v-card-text class="pb-0">
            <p>{{ selectedTaskShow.description ? selectedTaskShow.description : "Sem descrição" }}</p>
            <p class="font-italic">Criado em 30/10/2019 16:07</p>
          </v-card-text>
          <v-card-text class="pt-0">
            <v-container fluid class="pa-0">
              <v-row>
                <v-col cols="12" md="8">
                  <v-row>
                    <v-col cols="12" md="12" v-if="testCheckList">
                      <v-list>
                        <v-subheader>Checklist</v-subheader>
                        <v-progress-linear value="15"></v-progress-linear>
                        <v-list-item-group
                          multiple
                          active-class=""
                        >
                          <v-list-item>
                            <template v-slot:default="{ active }">
                              <v-list-item-action>
                                <v-checkbox v-model="active"></v-checkbox>
                              </v-list-item-action>

                              <v-list-item-content>
                                <v-list-item-title>Notifications</v-list-item-title>
                              </v-list-item-content>
                            </template>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-textarea
                        solo
                        name="input-7-4"
                        label="Adicionar comentário"
                      ></v-textarea>
                    </v-col>
                    <v-col class="text-right pt-0" cols="12" md="12">
                      <v-btn>Adicionar</v-btn>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="4">
                  <p class="font-weight-bold">Informações</p>
                  <p class="font-weight-light">Prazo de entrega: 28/11/2019</p>
                  <p class="font-weight-light">Prioridade: Média</p>
                  <p class="font-weight-light">Total em horas: 02:35</p>

                  <p class="font-weight-bold mt-5">Timer</p>
                  <v-btn block>
                    <v-icon>mdi-alarm</v-icon> Iniciar
                  </v-btn>

                  <p class="font-weight-bold mt-5">Funções</p>
                  <v-btn block @click="testCheckList = !testCheckList">
                    <v-icon>mdi-plus</v-icon> Checklist
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="darken-1" @click="onCloseShowTask">Fechar</v-btn>
          </v-card-actions>
        </div>
        <div v-else>
          <v-card-text>
            Carregando
            <v-progress-linear
              indeterminate
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </div>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  data () {
    return {
      columns: [
        {
          id: 1,
          name: 'Início',
          cards: [
            {
              name: 'Teste início',
              description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
              id: '2',
              hover: false
            }
          ]
        }
      ],
      dialogShowTask: false,
      selectedTaskShow: {},
      isAddingCard: false,
      cardCreating: {},
      isAddingColumn: false,
      nameColumn: '',

      //Testes
      testCheckList: false
    }
  },
  methods: {
    onShowTask (element) {
      this.$router.push({ query: { task: element.id }})
      this.dialogShowTask = true
      setTimeout(() => {
        this.selectedTaskShow = element
      }, 500)
    },
    onCloseShowTask () {
      this.$router.push({ query: {}})
      this.dialogShowTask = false
      this.selectedTaskShow = {}
    },
    addCard (column) {
      this.isAddingCard = true
      column.isAddingCard = true
      column.cards.push({
        id: Math.random(),
        name: '',
        description: '',
        hover: false,
        editable: true
      })
      
      setTimeout(() => {
        this.$refs['inputAddCard' + column.id][0].focus()
      }, 100)
      this.scrollTo('#idColumn' + column.id, 'top')
    },
    scrollTo (element, direction = 'top') {
      setTimeout(() => {
        let container = this.$el.querySelector(element)
        if(direction == 'top') {
          container.scrollTop = container.scrollHeight
        } else if(direction == 'right') {
          container.scrollLeft = container.scrollWidth
        }
      }, 1)
    },
    addColumn () {
      this.isAddingColumn = true
      setTimeout(() => {
        this.$refs.inputAddColumn.focus()
        this.scrollTo('#board', 'right')
      }, 100)
    },
    confirmAddColumn () {
      let column = {
        id: Math.floor((Math.random() * 1000000) + 1),
        name: this.nameColumn,
        cards: []
      }
      this.columns.push(column)
      this.isAddingColumn = false
      this.nameColumn = ''
      this.scrollTo('#board', 'right')
    },
    onAddConfirmCard (column) {
      this.isAddingCard = false
      column.isAddingCard = false
      column.cards = column.cards.filter((card) => {
        if (card.editable) {
          if (card.name || !0 === card.name.length) {
            card.editable = false
            return card
          }
        } else {
          return card
        }
      })
      
      this.scrollTo('#idColumn' + column.id, 'top')
    }
  },
  watch: {
    $route(to) {
      // react to route changes...
      if(!('task' in to.query)) {
        this.onCloseShowTask()
      }
    }
  },
  mounted () {
    for (let i = 0; i < 20; i++) {
      this.columns[0].cards.push({
        id: Math.random(),
        name: 'teste ' + i,
        description: 'Descrição ' + i,
        hover: false,
        editable: false
      })
    }

    for (let i = 0; i < 6; i++) {
      let column = {
        id: Math.floor((Math.random() * 1000000) + 1),
        name: 'Teste automático ' + i,
        cards: []
      }
      this.columns.push(column)
    }

    if('task' in this.$route.query) {
      let task = this.$route.query.task
      for (let iColumn = 0; iColumn < this.columns.length; iColumn++) {
        for(let iCard = 0; iCard < this.columns[iColumn].cards.length; iCard++) {
          if(this.columns[iColumn].cards[iCard].id == task) {
            this.onShowTask(this.columns[iColumn].cards[iCard])
            return
          }
        }
      }
    }
  }
}
</script>


<style>

#board {
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  box-sizing: border-box;
  padding: 10px;
  align-items: flex-start;
  overflow-x: auto;
  flex-wrap: nowrap
}

.borderText {
  border: 1px solid
}

.minHeight {
  min-height: 350px
}

.ghost, .sortable-chesen {
  opacity: 0.5;
}

.draggable{
  border: 1px solid
}

.widthColumn {
  width: 300px !important;
  display: flex;
  flex: 0 0 auto;
}

.cardColumm {
  max-height: 100%;
  flex-direction: column;
  display: flex;
  flex: 0 0 auto;
  align-items: stretch !important;
  box-sizing: border-box;
  box-shadow: 1px 1px 3px -2px #000
}

.cardColummHeader {
  flex: 0 0 auto;
  position: relative;
}

.cardColummContent {
  flex: 1 1 auto;
  margin-bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  min-height: 0;
}

.draggable{
  min-height: 150px;
  border: 1px solid;
  display:inline
}

.hoverPointer:hover {
  cursor: pointer;
}

.hoverGrab:hover {
  cursor: grab
}

.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}

.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}



.scrollBar::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 5px;
	background-color: rgba(0,0,0,0.1);
}

.scrollBar::-webkit-scrollbar
{
	width: 6px;
	background-color: rgba(0,0,0,0.1);
}

.scrollBar::-webkit-scrollbar-thumb
{
	border-radius: 5px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: #555;
}
</style>