import { executeQuery } from '../config/database';

const tanggal = '2023-11-14';
const queryNotMatchInbound = `select jde_item_code,no_bc11,no_pos_bc11,sum(round(jml_satuan,2)) as jml_tps, ( select sum(round(otqty,2)) as qty from jde_tps where jde_item_code = jde_tps.OTLITM and no_bc11 = jde_tps.OTBC11 and no_pos_bc11 = jde_tps.OTPOSN and jde_tps.OTDCCD = '1' limit 1 ) as jde_jml, ( select CASE WHEN sum(round(otqty,2)) = sum(round(jml_satuan,2)) THEN "MATCH" ELSE "NO" END as compare from jde_tps where jde_item_code = jde_tps.OTLITM and no_bc11 = jde_tps.OTBC11 and no_pos_bc11 = jde_tps.OTPOSN and jde_tps.OTDCCD = '1' limit 1 ) as compare from inbound_detail inner join inbound_header h on h.id = inbound_detail.inbound_header_id where inbound_detail.created_at <= '${tanggal}' and kd_dok = '1' and status = 'S' group by jde_item_code,no_bc11,no_pos_bc11;`;
const queryNotMatchOutbound = `select jde_item_code,no_bc11,no_pos_bc11,sum(round(jml_satuan,2)) as jml_tps, ( select sum(round(otqty,2)) as qty from jde_tps where jde_item_code = jde_tps.OTLITM and no_bc11 = jde_tps.OTBC11 and no_pos_bc11 = jde_tps.OTPOSN and jde_tps.OTDCCD = '3' limit 1 ) as jde_jml, ( select CASE WHEN sum(round(otqty,2)) = sum(round(jml_satuan,2)) THEN "MATCH" ELSE "NO" END as compare from jde_tps where jde_item_code = jde_tps.OTLITM and no_bc11 = jde_tps.OTBC11 and no_pos_bc11 = jde_tps.OTPOSN and jde_tps.OTDCCD = '3' limit 1 ) as compare from outbound_detail where  created_at <= '${tanggal}' group by jde_item_code,no_bc11,no_pos_bc11;`;
const queryNotMatchAdjustmentX = `select jde_item_code,no_bc11,no_pos_bc11,sum(round(jml_satuan,2)) as jml_tps, ( select sum(round(otqty,2)) as qty from jde_tps where jde_item_code = jde_tps.OTLITM and no_bc11 = jde_tps.OTBC11 and no_pos_bc11 = jde_tps.OTPOSN and jde_tps.OTDCCD = 'X' limit 1 ) as jde_jml, ( select CASE WHEN sum(round(otqty,2)) = sum(round(jml_satuan,2)) THEN "MATCH" ELSE "NO" END as compare from jde_tps where jde_item_code = jde_tps.OTLITM and no_bc11 = jde_tps.OTBC11 and no_pos_bc11 = jde_tps.OTPOSN and jde_tps.OTDCCD = 'X' limit 1 ) as compare from adjustment_detail inner join adjustment_header h on h.id = adjustment_detail.adjustment_header_id where adjustment_detail.created_at <= '${tanggal}' and kd_dok = 'X' and status = 'S' group by jde_item_code,no_bc11,no_pos_bc11;`;
const queryNotMatchAdjustmentY = `select jde_item_code,no_bc11,no_pos_bc11,sum(round(jml_satuan,2)) as jml_tps, ( select sum(round(otqty,2)) as qty from jde_tps where jde_item_code = jde_tps.OTLITM and no_bc11 = jde_tps.OTBC11 and no_pos_bc11 = jde_tps.OTPOSN and jde_tps.OTDCCD = 'Y' limit 1 ) as jde_jml, ( select CASE WHEN sum(round(otqty,2)) = sum(round(jml_satuan,2)) THEN "MATCH" ELSE "NO" END as compare from jde_tps where jde_item_code = jde_tps.OTLITM and no_bc11 = jde_tps.OTBC11 and no_pos_bc11 = jde_tps.OTPOSN and jde_tps.OTDCCD = 'Y' limit 1 ) as compare from adjustment_detail inner join adjustment_header h on h.id = adjustment_detail.adjustment_header_id where adjustment_detail.created_at <= '${tanggal}' and kd_dok = 'Y' and status = 'S' group by jde_item_code,no_bc11,no_pos_bc11;`;


export default class CompareController{
    static async inbound(req,res){
        const title = "Inbound"
        const data = await executeQuery(queryNotMatchInbound);
        res.render('compare',{data,title});
    }
    static async outbound(req,res){
        const title = "Outbound"
        const data = await executeQuery(queryNotMatchOutbound);
        res.render('compare',{data,title});
    }
    static async adjustmentX(req,res){
        const title = "Adjustment X"
        const data = await executeQuery(queryNotMatchAdjustmentX);
        res.render('compare',{data,title});
    }
    static async adjustmentY(req,res){
        const title = "Adjustment Y"
        const data = await executeQuery(queryNotMatchAdjustmentY);
        res.render('compare',{data,title});
    }

    static async generate(req,res){
        
        const param = req.query
        const title = param.title
        const table = title.toLowerCase()
        console.log(table)
        console.log(param.code)
        let query = "";
        switch (param.code) {
            case "1":
                query = queryNotMatchInbound;
                break;
            case "3":
                query = queryNotMatchOutbound;
                break;
            case "X":
                query = queryNotMatchAdjustmentX;
                break;
            case "Y":
                query = queryNotMatchAdjustmentY;
                break;
        
            default:
                break;
        }
        const dataMatch = await executeQuery(query);
        const dataNotMatch = dataMatch.filter(match => match.compare == "NO")
        
        let tpsId = [];
        let tpsDetailId = [];
        let jdeId = [];
        let queryNotMatchJdeIn = '';
        
        for (let index = 0; index < dataNotMatch.length; index++) {
            const notMatch = dataNotMatch[index];
            const whereTps = []
            //=======  PROCES DELETE =========
            if(notMatch.jde_item_code){
                whereTps.push(`jde_item_code = '${notMatch.jde_item_code}'`)
            }
            if(notMatch.no_bc11){
                whereTps.push(`no_bc11 = '${notMatch.no_bc11}'`)
            }
            if(notMatch.no_pos_bc11){
                whereTps.push(`no_pos_bc11 = '${notMatch.no_pos_bc11}'`)
            }
            queryNotMatchJdeIn = `('${notMatch.jde_item_code}','${notMatch.no_bc11}','${notMatch.no_pos_bc11}','${param.code}')`;
            let dataTpsNew = [];
            let dataJdeNew = [];  
            let dataJdeNewId = [];  
            var dataTps = await executeQuery(`select ${table}_header_id as h_id,id,jde_item_code,no_bc11,no_pos_bc11,jml_satuan,wk_inout from  ${table}_detail d where ${whereTps.join(" and ")} and created_at <= '${tanggal}' order by jml_satuan asc`);
            for (let index = 0; index < dataTps.length; index++) {
                const tps = dataTps[index];
                var dataJde = await executeQuery(`select id,OTLITM as jde_item_code_jde,OTBC11 as no_bc11_jde,OTPOSN as no_pos_bc11_jde,OTQTY as jml_satuan_jde,OTDIOT AS wk_inout_jde,jde_tps.* from jde_tps where OTLITM = '${tps.jde_item_code}' and OTBC11 = '${tps.no_bc11}' and OTPOSN = '${tps.no_pos_bc11}' and OTDCCD = '3' and OTDIOT = '${tps.wk_inout}'  order by OTQTY asc`); 
                
                if(dataJde.length > 0){
                    dataJdeNewId.push(dataJde[0].id) 
                    dataJdeNew.push(dataJde[0]);
                
                }else{
                    tpsId.push(tps.h_id)
                    tpsDetailId.push(tps.id)
                    dataJdeNew.push({id:null})
                }
            }
            dataNotMatch[index].fromTPS = {tps:dataTps,jde:dataJdeNew};
            if(tpsId.length > 0){
                await executeQuery(`delete from ${table}_header where id in(${tpsId.join(",")})`); 
            }

            if(tpsDetailId.length > 0){
                await executeQuery(`delete from ${table}_detail where id in(${tpsDetailId.join(",")})`); 
            }

            //=======  END OF PROCESS DELETE =========

            //=======  PROCES ADD =========

            var dataJde = await executeQuery(`select id,OTLITM as jde_item_code_jde,OTBC11 as no_bc11_jde,OTPOSN as no_pos_bc11_jde,OTQTY as jml_satuan_jde,OTDIOT AS wk_inout_jde,jde_tps.* from jde_tps where(OTLITM,OTBC11,OTPOSN,OTDCCD) in (${queryNotMatchJdeIn}) order by OTQTY asc`); 
            //menampung data jde
            for (let index = 0; index < dataJde.length; index++) {
                const jde = dataJde[index];
                let dataTps2 = await executeQuery(`select id,jde_item_code,no_bc11,no_pos_bc11,jml_satuan from  ${table}_detail d where d.jde_item_code = '${jde.jde_item_code_jde}' and d.no_bc11 = '${jde.no_bc11_jde}' and d.no_pos_bc11 = '${jde.no_pos_bc11_jde}' and d.wk_inout = '${jde.wk_inout_jde}' and d.jml_satuan = ${parseFloat(jde.jml_satuan_jde)} and created_at <= '${tanggal}' order by jml_satuan asc`);   
                if(dataTps2.length > 0){
                    dataTpsNew.push(dataTps2[0]);
                    
                }else{
                    // ========= INSERT DATA ======
                    // ====== HEADER ===========
                    const values = [[jde.OTDOC, param.code, 'CSMI', jde.IMDSC1, jde.TPCINV, '-', null, '-', '-', 'JDE_IMPORT', 'S', null, 2,tanggal + ' 00:00:00']]
                    const result = await executeQuery(`insert into ${table}_header( doc_no, kd_dok, kd_tps, nm_angkut, no_voy_flight, call_sign, tgl_tiba, kd_gudang, ref_number, insert_from, status, user_id, company_profile_id,created_at) VALUES (?)`,values); 
                    const idRes = result.insertId;
                    // ======  HEADER ===========
                    // ====== DETAIL ===========
                    const valuesDetail = [
                        [idRes, '-', '-', '2021-09-09', '', 'PT. CASTROL MANUFACTURING INDONESIA', jde.OTBC11, '2021-09-10', jde.OTPOSN, 'ST-1206', jde.OTQTY, jde.OUTOM, '1', jde.OTDNIO, null, jde.OTDIOT, '-', '-', 'SGSIN', 'SGSIN', 'IDMRK', '36003_IM', jde.OTLITM, '23010493_OV', '', '0', '',tanggal + ' 00:00:00']
                    ] 
                    await executeQuery(`insert into ${table}_detail( ${table}_header_id, seri_out, no_bl_awb, tgl_bl_awb, id_consignee, consignee, no_bc11, tgl_bc11, no_pos_bc11, no_tangki, jml_satuan, jns_satuan, kd_dok_inout, no_dok_inout, tgl_dok_inout, wk_inout, kd_sar_angkut_inout, no_pol, pel_muat, pel_transit, pel_bongkar, jde_co_doc_ty, jde_item_code, jde_related_doc, future_use_01, future_use_04, future_use_07,created_at) VALUES (?)`,valuesDetail); 
                    // ====== DETAIL ===========
                    // ========= INSERT DATA ======
                    jdeId.push(jde.id);
                    dataTpsNew.push({id:null})
                } 
            }

            //=======  END OF PROCES ADD =========
            dataNotMatch[index].fromJDE = {tps:dataTpsNew,jde:dataJde};
        }
        res.render('generate_compare',{data : dataNotMatch,tpsId:tpsId,jdeId:jdeId,tpsDetailId:tpsDetailId,title:title} );

    }
    static async deleting(req,res){
        const param = req.query;
        const title = param.title + " Deleted"
        var idDeleted = [];
        const table = param.title.toLowerCase();
        //jika jumlah tps lebih basar maka data di tps harus ada yg di hapus
        if(parseFloat(param.jml_tps) > parseFloat(param.jde_jml)){
            let whereQueryTps = "";
            if(param.code == "X" || param.code == "Y"){
                whereQueryTps = `jde_item_code='${param.jde_item_code}' and no_bc11 ='${param.no_bc11}' and no_pos_bc11 ='${param.no_pos_bc11}' and oh.kd_dok = '${param.code}'`
            }else{
                whereQueryTps = `jde_item_code='${param.jde_item_code}' and no_bc11 ='${param.no_bc11}' and no_pos_bc11 ='${param.no_pos_bc11}'`
            }
            let whereQueryJde = `OTLITM='${param.jde_item_code}' and OTBC11 ='${param.no_bc11}' and OTPOSN ='${param.no_pos_bc11}' and OTDCCD = '${param.code}'`
            var queryJde = `select count(OTQTY) as count,OTQTY from jde_tps where ${whereQueryJde} group by OTQTY order by OTQTY asc;`;
            var queryTps = `select count(jml_satuan) as count,jml_satuan,oh.id from ${table}_detail od left join ${table}_header oh on oh.id = od.${table}_header_id where ${whereQueryTps} group by jml_satuan order by jml_satuan asc`;
            console.log(queryTps)
            console.log(queryJde)
            var dataTps = await executeQuery(queryTps);
            var dataJde = await executeQuery(queryJde);
            var tpsVal = [];
            var jdeVal = [];
            for (let index = 0; index < dataTps.length; index++) {
                var tps = dataTps[index];
                for (let index2 = 0; index2 < dataJde.length; index2++) {
                    var jde = dataJde[index2];
                    if(parseInt(tps.jml_satuan) == parseInt(jde.OTQTY) && parseInt(tps.count) != parseInt(jde.count)){
                        tpsVal.push(tps);
                        jdeVal.push(jde);
                    }
                }
            }

            console.log(tpsVal)
            for (let index2 = 0; index2 < tpsVal.length; index2++) {
                var tps = tpsVal[index2];
                var dataTps2 = await executeQuery(`select od.id from outbound_detail od left join outbound_header oh on oh.id = od.outbound_header_id where jml_satuan = '${tps.jml_satuan}'  and oh.id is null`);
                for (let index3 = 0; index3 < dataTps2.length; index3++) {
                    const tps2 = dataTps2[index3];    
                    await executeQuery(`delete from ${table}_detail where id = ${tps2.id}`);    
                    idDeleted.push(tps2.id)   
                }
            }
            console.log(idDeleted)

        }
        
        res.render('deleting',{title:title,idDeleted:idDeleted} );
    }
}