document.addEventListener("DOMContentLoaded", function () {
    let e = e => document.getElementById(e), t = e("evaluationForm"), a = e("totalScore"), o = e("maxScore"), n = e("scoreUnit"), i = e("certName"), r = e("progressBar"), l = e("levelText"); e("certificationSelector"), e("projectTypeSelector"); let s = e("projectName"); e("saveProjectButton"), e("loadProjectButton"), e("deleteProjectButton"), e("savedProjectsSelector"), e("exportPdfButton"), e("resetButton"), e("carbonCalculatorBtn"); let c = e("memoriaGeneratorBtn"), d = {}, m = "lidera"; function u() { d = {}; let e = certificationsDB[m]?.data; if (!e) { p(); return } for (let t in e) for (let a in d[t] = {}, e[t]) d[t][a] = 0; p() } function p() { let e = certificationsDB[m]; if (!e) { a.textContent = "0.0", o.textContent = "0.0", i.textContent = "N/A", l.textContent = "N/A", r.style.width = "0%"; return } let t = function e() { let t = certificationsDB[m]; if (!t) return 0; let a = 0; if ("LiderA" === t.name && t.data) { let o = t.weights.edificio, n = 0, i = 0; for (let r in d) { let l = o[r] || 1; i += l; let s = 0, c = 0; for (let u in d[r]) s += d[r][u], t.data[r] && t.data[r][u] && t.data[r][u].credits && (c += Object.values(t.data[r][u].credits).reduce((e, t) => e + t, 0)); c > 0 && (n += s / c * l) } a = i > 0 ? n / i * t.maxScore : 0 } return a }(); a.textContent = t.toFixed(1), o.textContent = e.maxScore.toFixed(1), n.textContent = e.scoreUnit, i.textContent = e.name; let s = e.maxScore > 0 ? t / e.maxScore * 100 : 0; r.style.width = `${s}%`; let c = "N/A"; if (e.levels) { let u = Object.entries(e.levels).sort((e, t) => t[0] - e[0]); for (let [p, f] of u) if (t >= parseFloat(p)) { c = f; break } } l.textContent = c } t.addEventListener("change", e => { if (e.target.matches('input[type="checkbox"]')) { let { vertente: t, area: a, credit: o } = e.target.dataset, n = certificationsDB[m], i = n.data[t][a].credits[o]; d[t][a] += e.target.checked ? i : -i, p() } }), t.addEventListener("click", e => {
        let t = e.target.closest(".info-icon"); if (t) {
            let { vertente: a, area: o } = t.dataset, n = certificationsDB[m]?.data[a]?.[o]?.info; if (n) {
                let i = document.querySelector("#infoModal .modal-title"); i && (i.textContent = `Crit\xe9rio: ${o}`); let r = ""; n.normativa_pt && (r = `
                        <div class="normativa-section">
                            <h6>Normativa Aplic\xe1vel em Portugal</h6>
                            <p><strong>${n.normativa_pt.nome}</strong><br>
                               <a href="${n.normativa_pt.link}" target="_blank">Consultar Documento Oficial <i class="fas fa-external-link-alt fa-xs"></i></a>
                            </p>
                        </div>`); let l = document.querySelector("#infoModal .modal-body"); l && (l.innerHTML = `
                        <h6>Objetivo</h6><p>${n.objetivo}</p>
                        <h6>Exemplo de Aplica\xe7\xe3o</h6><p>${n.exemplo}</p>
                        <h6>Benef\xedcios do Projeto</h6><p>${n.beneficios}</p>
                        ${r}`, $("#infoModal").modal("show"))
            }
        } let s = e.target.closest(".solutions-icon"); if (s) {
            let { vertente: c, area: d } = s.dataset; (function e(t, a) {
                let o = certificationsDB[m].data, n = o[t][a]?.solucoes_pt; if (!n) return; let i = document.querySelector("#solutionsModal .modal-title"); i && (i.textContent = `Solu\xe7\xf5es de Mercado para: ${a}`); let r = document.querySelector("#solutionsModal .modal-body"); if (r) {
                    let l = n.map(e => {
                        let t = e.lcca_id, a = t && "undefined" != typeof lccaDB && lccaDB[t] ? `<button class="btn btn-success btn-sm mt-2 launch-lcca-btn" data-lcca-id="${t}">Analisar Custo de Ciclo de Vida</button>` : ""; return `
                    <div class="solution-card">
                        <h5>${e.nome}</h5>
                        <p class="solution-manufacturer"><strong>Fabricante/Marca:</strong> ${e.fabricante}</p>
                        <p><strong>Descri\xe7\xe3o:</strong> ${e.descricao}</p>
                        <p><strong>Aplica\xe7\xe3o T\xedpica:</strong> ${e.aplicacao}</p>
                        <a href="${e.link}" target="_blank" class="btn btn-outline-primary btn-sm">Visitar Website <i class="fas fa-external-link-alt"></i></a>
                        ${a}
                    </div>`}).join(""); r.innerHTML = l, $("#solutionsModal").modal("show")
                }
            })(c, d)
        }
    }), c.addEventListener("click", () => {
        let t = s.value.trim() || "este projeto", a = `MEM\xd3RIA DESCRITIVA DE SUSTENTABILIDADE
`; a += `PROJETO: ${t.toUpperCase()}

`, a += `A presente mem\xf3ria descreve as estrat\xe9gias de sustentabilidade adotadas para ${t}, com base nos crit\xe9rios do sistema de avalia\xe7\xe3o LiderA.

`; let o = document.querySelectorAll('#evaluationForm input[type="checkbox"]:checked'); if (0 === o.length) a += "Nenhum crit\xe9rio de sustentabilidade foi selecionado na avalia\xe7\xe3o."; else {
            let n = new Set, i = new Set; o.forEach(e => {
                let { vertente: t, area: o } = e.dataset; if (n.has(t) || (a += `
--- ${t.toUpperCase()} ---

`, n.add(t)), !i.has(o)) {
                    let r = certificationsDB[m]?.data[t]?.[o]?.info; r && r.memoria_descritiva && (a += `>> CRIT\xc9RIO: ${o.toUpperCase()}
`, a += `${r.memoria_descritiva}

`, i.add(o))
                }
            })
        } e("memoria-output").value = a, $("#memoriaModal").modal("show")
    }), e("copyMemoriaBtn").addEventListener("click", () => { let t = e("memoria-output"); t.select(), t.setSelectionRange(0, 99999), document.execCommand("copy"), alert("Texto copiado para a \xe1rea de transfer\xeancia!") }), function e() { let a = certificationsDB[m]; if (t.innerHTML = "", !a || !a.data) { t.innerHTML = '<p class="text-muted">Este sistema de certifica\xe7\xe3o ainda n\xe3o tem crit\xe9rios definidos na base de dados.</p>', u(); return } Object.entries(a.data).forEach(([e, a], o) => { let n = ""; Object.entries(a).forEach(([t, a]) => { let o = ""; a.credits && Object.keys(a.credits).forEach(a => { let n = `${m}-${e}-${t}-${a}`.replace(/[^a-zA-Z0-9]/g, ""); o += `<div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" id="${n}" data-vertente="${e}" data-area="${t}" data-credit="${a}"><label class="custom-control-label" for="${n}">${a}</label></div>` }); let i = a.solucoes_pt ? `<i class="fas fa-cubes solutions-icon" data-vertente="${e}" data-area="${t}" title="Ver Solu\xe7\xf5es de Mercado"></i>` : ""; n += `<div class="mb-4"><h5><span class="area-label">${t}<span class="icon-group"><i class="fas fa-info-circle info-icon" data-vertente="${e}" data-area="${t}"></i>${i}</span></span></h5>${o}</div>` }); let i = `<div class="card mb-3"><div class="card-header vertente-header" data-toggle="collapse" data-target="#vertente-${o}"><h4 class="mb-0">${e}</h4></div><div id="vertente-${o}" class="collapse ${0 === o ? "show" : ""}" data-parent="#evaluationForm"><div class="card-body">${n.replace(/<div class="mb-4">/g, '<hr class="my-4"><div class="mb-4">').replace('<hr class="my-4">', "")}</div></div></div>`; t.insertAdjacentHTML("beforeend", i) }), u() }()
});