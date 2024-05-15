const api = {

    number:1,
    toggle: false,
    searchTimeout: null,  

    next_pokemon(){

        this.number += 1;

        call_pokemon(this.number);

    },

    prev_pokemon(){

        this.number -= 1;

        if (this.number <= 1) this.number = 1;

        call_pokemon(this.number);

    },

    about_pokemon(){

        this.toggle = !this.toggle;

        if (this.toggle == true) $('#info-card').attr('class', 'col-6 text-center d-block');
        if (this.toggle == false) $('#info-card').attr('class', 'col-6 text-center d-none');
        

    },

    search_pokemon(text) {
        let self = this;
    
        // Cancelar a solicitação pendente, se houver
        clearTimeout(this.searchTimeout);
    
        // Configurar uma nova solicitação com atraso
        this.searchTimeout = setTimeout(() => {
            response_api(text).done((data) => {

                self.number = data.id;
                call_pokemon(text);

            }).fail((failing) => {
                if (failing.status == 404) {

                    let not_exist = $(`
                        <div id="fail" class="alert alert-warning alert-dismissible fade show" role="alert">
                            O pokémon mencionado não existe :/
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    `);

                    // Adicionando alerta de not found no topo na carta de apresentação com 'prepend()'
                    $('.card-body:eq(0)').prepend(not_exist);

                    setTimeout(() => {
                        

                        $("#fail").fadeOut(500, function(){
                            $(this).remove();
                        });

                    }, 2000);

                } else {
                    console.error(failing);
                    throw failing;
                }
            });
        }, 1000);
    }

}

const response_api = (text) => {

    return $.ajax("https://pokeapi.co/api/v2/pokemon/" + text + "/");

}

const call_pokemon = (idorname)  => {
            
    if (idorname == '' || idorname == null || idorname == NaN || idorname.length == 0) {
        
        api.number = 1;
        idorname = 1;

    }


    $.ajax( "https://pokeapi.co/api/v2/pokemon/" + idorname + "/" )
    .done(function(data) {

        let formated_name = data.name.at(0).toUpperCase() + data.name.substr(1, data.name.length)
    
        //CART 1 - SHOWING
        $('#display').attr('src', data.sprites.other.showdown.front_default);//altera a imagem N/A para imagem do pokémon..
        $('#name').text(formated_name)//nome do pokemon com primeira letra em maiusculo..
        $('#info').html(`O <b>${formated_name}</b> pesa <b>${data.weight}</b> pesos, tem <b>${data.moves.length}</b> movimentos, <b>${data.abilities.length}</b> habilidades e <b>${data.height}</b> de alturas. É do tipo <b>${data.types[0].type.name.toUpperCase()}</b>!`)
    
        // Limpar o conteúdo antes de adicionar os novos elementos
        $('#stats div p').remove();

        // Adicionar life
        let life = $(`<p class="fw-bold m-0">${data.stats[0].base_stat}</p>`);
        $('#stats div:eq(0)').append(life);

        // Adicionar attack
        let attack = $(`<p class="fw-bold m-0">${data.stats[1].base_stat}</p>`);
        $('#stats div:eq(1)').append(attack);

        // Adicionar defense
        let defense = $(`<p class="fw-bold m-0">${data.stats[2].base_stat}</p>`);
        $('#stats div:eq(2)').append(defense);
        
        //experiencia do pokemon
        $('#exp').html(`${formated_name} tem <b>${data.base_experience}</b> de experiência.`)
  
        //abilits  
        //limpando conteiner antes de add
        $('#abis').html('');

        //declarar quantas habilidates tem no titulo azul..
        $('#abis').append($('<li class="list-group-item list-group-item-action list-group-item">Habilidades ' + '(' + data.abilities.length + ')</li>'));
        
        //adicionar as habilidades no info card..
        data.abilities.forEach(element => {
            
            //criando a linha..
            let abi = $(`<li class='list-group-item list-group-item-action list-group-item'>${element.ability.name}</li>`);
    
            //adicionando a lista..
            $('#abis').append(abi);
    
        });
  
  
    })
    .fail(function(erro) {
      console.error(erro);
      // alert( "Não foi possível carregar a aplicação. Tente novamente mais tarde." );
      // window.location = 'https://pokeapi.co'
  
    })
    .always(function(data) {
  
      console.log('visite meu portfólio - vdanviel.github.io :)');
  
    });
  
}

$(document).ready(() => {

call_pokemon(1);

})
