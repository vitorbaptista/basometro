var tipos_de_voto = ["NAO","SIM","ABSTENCAO","OBSTRUCAO","NAO VOTOU","PRESIDENTE"];
var politico = {}; //politicos
var votacao = {}; //votacoes
var voto = {}; //votacoes
var obj = {"politicos":{},"votacoes":{},"votos":[]};
var errors = [];
var votacoes_erradas = [];

//helpers functions
function ds_opt (filename) {
    return {url : "../bases/"+filename+".csv", delimiter : ";"}
}

$(document).ready(function(){

    var politicos_ds = new Miso.Dataset(ds_opt("Politicos"));
    var votacoes_ds = new Miso.Dataset(ds_opt("Votacoes"));
    var votos_ds = new Miso.Dataset(ds_opt("Votos"));
    var stop = 200;

    //BERNARDO SANTANA DE VASCONCELLOs <--- tem que ser S
    //ANTONIO CARLOS BIFFI <--- está com nome da casa como BIFFI
    //cabecalho do Politicos.csv
    //"POLITICO";"SOBRENOME";"NOME_MINUSCULA";"NOME_CASA_MINUSCULA";"NOME_CASA";"PARTIDO";"UF";"ID";"ANO_MANDATO";"LEGISLATURA";"URL_FOTO"
    //cabecalho do Votacoes.csv
    //"ID_VOTACAO";"DATA";"HORA";"ORIENTACAO_GOVERNO";"TIPO";"NUMERO";"ANO";"EMENTA";"O_QUE_FOI_VOTADO";"LINGUAGEM_COMUM"
    //cabecalho do VOtos.csv
    //"ID_VOTACAO";"POLITICO";"VOTO";"PARTIDO"


  _.when(politicos_ds.fetch(),votacoes_ds.fetch(),votos_ds.fetch()).then(function(){

    politicos_ds.each(function(row) {
      obj.politicos[row.NOME_CASA] = row;
      delete obj.politicos[row.NOME_CASA]._id;
      delete obj.politicos[row.NOME_CASA].NOME_CASA;
    });
    votacoes_ds.each(function(row) {
      obj.votacoes[String(row.ID_VOTACAO)] = row;
      delete obj.votacoes[String(row.ID_VOTACAO)]._id;
      delete obj.votacoes[String(row.ID_VOTACAO)].ID_VOTACAO;
    });
    votos_ds.each(function(row) {
        if (!obj.politicos[row.POLITICO] && errors.indexOf(row.POLITICO) == -1) errors.push(row.POLITICO);
        var numb_voto = tipos_de_voto.indexOf(row.VOTO);
        if(numb_voto == -1 && stop > 0) {
            console.log(row);
            stop--;
            if (votacoes_erradas.indexOf(row.ID_VOTACAO) == -1) votacoes_erradas.push(row.ID_VOTACAO);
        }
        //console.log(row.POLITICO)
        var voto = [obj.politicos[row.POLITICO].ID,row.ID_VOTACAO,row.PARTIDO,numb_voto]; //[id_pol,id_votacao,partido,voto]
      obj.votos.push(voto)
    });

    for (var i = errors.length - 1; i >= 0; i--) {
        console.log(errors[i])
    };
    if (votacoes_erradas.length > 0) console.log(votacoes_erradas);

    //$("#corpo").append(JSON.stringify(obj))
    var strData = JSON.stringify(obj);
    var blob = new Blob([strData], {type:"text/plain;charset=utf-8"});
    saveAs(blob,"dados.json");
    })

});
