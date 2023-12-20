import { executeQuery } from '../config/database';
const tanggal = '2023-11-14';
const queryNotMatchInbound = `select jde_item_code,no_bc11,no_pos_bc11,sum(round(jml_satuan,2)) as jml_tps, ( select sum(round(otqty,2)) as qty from jde_tps where jde_item_code = jde_tps.OTLITM and no_bc11 = jde_tps.OTBC11 and no_pos_bc11 = jde_tps.OTPOSN and jde_tps.OTDCCD = '1' limit 1 ) as jde_jml, ( select CASE WHEN sum(round(otqty,2)) = sum(round(jml_satuan,2)) THEN "MATCH" ELSE "NO" END as compare from jde_tps where jde_item_code = jde_tps.OTLITM and no_bc11 = jde_tps.OTBC11 and no_pos_bc11 = jde_tps.OTPOSN and jde_tps.OTDCCD = '1' limit 1 ) as compare from inbound_detail inner join inbound_header h on h.id = inbound_detail.inbound_header_id where inbound_detail.created_at <= '2023-11-14' and kd_dok = '1' and oh.status = 'S' group by jde_item_code,no_bc11,no_pos_bc11;`;
const queryNotMatchOutbound = `select jde_item_code,no_bc11,no_pos_bc11,sum(round(jml_satuan,2)) as jml_tps, ( select sum(round(otqty,2)) as qty from jde_tps where jde_item_code = jde_tps.OTLITM and no_bc11 = jde_tps.OTBC11 and no_pos_bc11 = jde_tps.OTPOSN and jde_tps.OTDCCD = '3' limit 1 ) as jde_jml, ( select CASE WHEN sum(round(otqty,2)) = sum(round(jml_satuan,2)) THEN "MATCH" ELSE "NO" END as compare from jde_tps where jde_item_code = jde_tps.OTLITM and no_bc11 = jde_tps.OTBC11 and no_pos_bc11 = jde_tps.OTPOSN and jde_tps.OTDCCD = '3' limit 1 ) as compare from outbound_detail where  created_at <= '2023-11-14' group by jde_item_code,no_bc11,no_pos_bc11;`;
const queryNotMatchAdjustmentX = `select jde_item_code,no_bc11,no_pos_bc11,sum(round(jml_satuan,2)) as jml_tps, ( select sum(round(otqty,2)) as qty from jde_tps where jde_item_code = jde_tps.OTLITM and no_bc11 = jde_tps.OTBC11 and no_pos_bc11 = jde_tps.OTPOSN and jde_tps.OTDCCD = 'X' limit 1 ) as jde_jml, ( select CASE WHEN sum(round(otqty,2)) = sum(round(jml_satuan,2)) THEN "MATCH" ELSE "NO" END as compare from jde_tps where jde_item_code = jde_tps.OTLITM and no_bc11 = jde_tps.OTBC11 and no_pos_bc11 = jde_tps.OTPOSN and jde_tps.OTDCCD = 'X' limit 1 ) as compare from adjustment_detail inner join adjustment_header h on h.id = adjustment_detail.adjustment_header_id where adjustment_detail.created_at <= '2023-11-14' and kd_dok = 'X' and status = 'S' group by jde_item_code,no_bc11,no_pos_bc11;`;
const queryNotMatchAdjustmentY = `select jde_item_code,no_bc11,no_pos_bc11,sum(round(jml_satuan,2)) as jml_tps, ( select sum(round(otqty,2)) as qty from jde_tps where jde_item_code = jde_tps.OTLITM and no_bc11 = jde_tps.OTBC11 and no_pos_bc11 = jde_tps.OTPOSN and jde_tps.OTDCCD = 'Y' limit 1 ) as jde_jml, ( select CASE WHEN sum(round(otqty,2)) = sum(round(jml_satuan,2)) THEN "MATCH" ELSE "NO" END as compare from jde_tps where jde_item_code = jde_tps.OTLITM and no_bc11 = jde_tps.OTBC11 and no_pos_bc11 = jde_tps.OTPOSN and jde_tps.OTDCCD = 'Y' limit 1 ) as compare from adjustment_detail inner join adjustment_header h on h.id = adjustment_detail.adjustment_header_id where adjustment_detail.created_at <= '2023-11-14' and kd_dok = 'Y' and status = 'S' group by jde_item_code,no_bc11,no_pos_bc11;`;

export default class DeletingController{
     
    static async inbound(req,res){
        const title = "Inbound"
        const dataMatch = await executeQuery(queryNotMatchInbound);
        const dataNotMatch = dataMatch.filter(match => match.compare == "NO")
        let tpsId = [];
        let tpsDetailId = [];
        let jdeId = [];
        let queryNotMatchJdeIn = '';
        for (let index = 0; index < dataNotMatch.length; index++) {
            const notMatch = dataNotMatch[index];
            const whereTps = []
            if(notMatch.jde_item_code){
                whereTps.push(`jde_item_code = '${notMatch.jde_item_code}'`)
            }
            if(notMatch.no_bc11){
                whereTps.push(`no_bc11 = '${notMatch.no_bc11}'`)
            }
            if(notMatch.no_pos_bc11){
                whereTps.push(`no_pos_bc11 = '${notMatch.no_pos_bc11}'`)
            }
            queryNotMatchJdeIn = `('${notMatch.jde_item_code}','${notMatch.no_bc11}','${notMatch.no_pos_bc11}','Y')`;
            let dataTpsNew = [];
            let dataJdeNew = [];  
            //DELETE DATA YANG ADA DI TPS TAPI TIDAK ADA DI JDE
            var dataTps = await executeQuery(`select inbound_header_id,d.id,jde_item_code,no_bc11,no_pos_bc11,jml_satuan,wk_inout from inbound_detail d inner join inbound_header h on h.id = d.inbound_header_id where  ${whereTps.join(" and ")} and d.created_at <= '${tanggal}' and kd_dok = 'Y' order by jml_satuan asc`);
            for (let index = 0; index < dataTps.length; index++) {
                const tps = dataTps[index];
                var dataJde = await executeQuery(`select id,OTLITM as jde_item_code_jde,OTBC11 as no_bc11_jde,OTPOSN as no_pos_bc11_jde,OTQTY as jml_satuan_jde,OTDIOT AS wk_inout_jde,jde_tps.* from jde_tps where OTLITM = '${tps.jde_item_code}' and OTBC11 = '${tps.no_bc11}' and OTPOSN = '${tps.no_pos_bc11}' and OTDCCD = 'Y' and OTDIOT = '${tps.wk_inout}'  order by OTQTY asc`); 
                if(dataJde.length > 0){
                    dataJdeNew.push(dataJde[0]);
                }else{
                    tpsId.push(tps.inbound_header_id);
                    tpsDetailId.push(tps.id);
                    dataJdeNew.push({id:null});
                }
            }
            dataNotMatch[index].fromTPS = {tps:dataTps,jde:dataJdeNew};
            if(tpsId.length > 0){
                await executeQuery(`delete from inbound_header where id in(${tpsId.join(",")})`); 
            }
    
            if(tpsDetailId.length > 0){
                await executeQuery(`delete from inbound_detail where id in(${tpsDetailId.join(",")})`); 
            }
            //==========
            var dataJde = await executeQuery(`select id,OTLITM as jde_item_code_jde,OTBC11 as no_bc11_jde,OTPOSN as no_pos_bc11_jde,OTQTY as jml_satuan_jde,OTDIOT AS wk_inout_jde,jde_tps.* from jde_tps where(OTLITM,OTBC11,OTPOSN,OTDCCD) in (${queryNotMatchJdeIn}) order by OTQTY asc`); 
            //menampung data jde
            for (let index = 0; index < dataJde.length; index++) {
                const jde = dataJde[index];
                let dataTps2 = await executeQuery(`select d.id,jde_item_code,no_bc11,no_pos_bc11,jml_satuan from  inbound_detail d inner join inbound_header h on h.id = d.inbound_header_id where d.jde_item_code = '${jde.jde_item_code_jde}' and d.no_bc11 = '${jde.no_bc11_jde}' and d.no_pos_bc11 = '${jde.no_pos_bc11_jde}' and d.wk_inout = '${jde.wk_inout_jde}' and d.jml_satuan = ${parseFloat(jde.jml_satuan_jde)} and d.created_at <= '${tanggal}' and kd_dok = 'Y' order by jml_satuan asc`);   
                if(dataTps2.length > 0){
                    dataTpsNew.push(dataTps2[0]);
                    
                }else{
                    // ========= INSERT DATA ======
                    // ====== HEADER ===========
                    const values = [[jde.OTDOC, 'Y', 'CSMI', jde.IMDSC1, jde.TPCINV, '-', null, '-', '-', 'FTP', 'S', null, 2]]
                    const result = await executeQuery('insert into inbound_header( `doc_no`, `kd_dok`, `kd_tps`, `nm_angkut`, `no_voy_flight`, `call_sign`, `tgl_tiba`, `kd_gudang`, `ref_number`, `insert_from`, `status`, `user_id`, `company_profile_id`) VALUES (?)',values); 
                    const idRes = result.insertId;
                    // ======  HEADER ===========
                    // ====== DETAIL ===========
                    const valuesDetail = [
                        [idRes, '1', '-', '2021-09-09', '', 'PT. CASTROL MANUFACTURING INDONESIA', jde.OTBC11, '2021-09-10', jde.OTPOSN, 'ST-1206', jde.OTQTY, jde.OUTOM, '1', jde.OTDNIO, null, jde.OTDIOT, '-', '-', 'SGSIN', 'SGSIN', 'IDMRK', '36003_IM', jde.OTLITM, '23010493_OV', '', '0', '']
                    ] 
                    await executeQuery('insert into inbound_detail( `inbound_header_id`, `seri_out`, `no_bl_awb`, `tgl_bl_awb`, `id_consignee`, `consignee`, `no_bc11`, `tgl_bc11`, `no_pos_bc11`, `no_tangki`, `jml_satuan`, `jns_satuan`, `kd_dok_inout`, `no_dok_inout`, `tgl_dok_inout`, `wk_inout`, `kd_sar_angkut_inout`, `no_pol`, `pel_muat`, `pel_transit`, `pel_bongkar`, `jde_co_doc_ty`, `jde_item_code`, `jde_related_doc`, `future_use_01`, `future_use_04`, `future_use_07`) VALUES (?)',valuesDetail); 
                    // ====== DETAIL ===========
                    // ========= INSERT DATA ======
                    jdeId.push(jde.id);
                    dataTpsNew.push({id:null})
                } 
            }
            dataNotMatch[index].fromJDE = {tps:dataTpsNew,jde:dataJde};
        }
        res.render('generate_compare',{data : dataNotMatch,tpsId:tpsId,jdeId:jdeId,tpsDetailId:tpsDetailId,tpsDetailId:tpsDetailId,title:title} );
        
    }
    static async outbound(req,res){
        

    }
    static async adjustmentX(req,res){
        const title = "Adjustment X"
        const dataMatch = await executeQuery(queryNotMatchAdjustmentX);
        const dataNotMatch = dataMatch.filter(match => match.compare == "NO")
        let tpsId = [];
        let tpsDetailId = [];
        let jdeId = [];
        let queryNotMatchJdeIn = '';
        for (let index = 0; index < dataNotMatch.length; index++) {
            const notMatch = dataNotMatch[index];
            const whereTps = []
            if(notMatch.jde_item_code){
                whereTps.push(`jde_item_code = '${notMatch.jde_item_code}'`)
            }
            if(notMatch.no_bc11){
                whereTps.push(`no_bc11 = '${notMatch.no_bc11}'`)
            }
            if(notMatch.no_pos_bc11){
                whereTps.push(`no_pos_bc11 = '${notMatch.no_pos_bc11}'`)
            }
            queryNotMatchJdeIn = `('${notMatch.jde_item_code}','${notMatch.no_bc11}','${notMatch.no_pos_bc11}','X')`;
            let dataTpsNew = [];
            let dataJdeNew = [];  
            var dataTps = await executeQuery(`select adjustment_header_id,d.id,jde_item_code,no_bc11,no_pos_bc11,jml_satuan,wk_inout from adjustment_detail d inner join adjustment_header h on h.id = d.adjustment_header_id where  ${whereTps.join(" and ")}and d.created_at <= '${tanggal}' and kd_dok = 'X' order by jml_satuan asc`);

            for (let index = 0; index < dataTps.length; index++) {
                const tps = dataTps[index];
                var dataJde = await executeQuery(`select id,OTLITM as jde_item_code_jde,OTBC11 as no_bc11_jde,OTPOSN as no_pos_bc11_jde,OTQTY as jml_satuan_jde,OTDIOT AS wk_inout_jde,jde_tps.* from jde_tps where OTLITM = '${tps.jde_item_code}' and OTBC11 = '${tps.no_bc11}' and OTPOSN = '${tps.no_pos_bc11}' and OTDCCD = 'X' and OTDIOT = '${tps.wk_inout}'  order by OTQTY asc`); 
                if(dataJde.length > 0){
                    dataJdeNew.push(dataJde[0]);
                }else{
                    tpsId.push(tps.adjustment_header_id);
                    tpsDetailId.push(tps.id);
                    dataJdeNew.push({id:null});
                }
            }
            dataNotMatch[index].fromTPS = {tps:dataTps,jde:dataJdeNew};
            if(tpsId.length > 0){
                await executeQuery(`delete from adjustment_header where id in(${tpsId.join(",")})`); 
            }

            if(tpsDetailId.length > 0){
                await executeQuery(`delete from adjustment_detail where id in(${tpsDetailId.join(",")})`); 
            }

            var dataJde = await executeQuery(`select id,OTLITM as jde_item_code_jde,OTBC11 as no_bc11_jde,OTPOSN as no_pos_bc11_jde,OTQTY as jml_satuan_jde,OTDIOT AS wk_inout_jde,jde_tps.* from jde_tps where(OTLITM,OTBC11,OTPOSN,OTDCCD) in (${queryNotMatchJdeIn}) order by OTQTY asc`); 
            //menampung data jde
            for (let index = 0; index < dataJde.length; index++) {
                const jde = dataJde[index];
                let dataTps2 = await executeQuery(`select d.id,jde_item_code,no_bc11,no_pos_bc11,jml_satuan from  adjustment_detail d inner join adjustment_header h on h.id = d.adjustment_header_id where d.jde_item_code = '${jde.jde_item_code_jde}' and d.no_bc11 = '${jde.no_bc11_jde}' and d.no_pos_bc11 = '${jde.no_pos_bc11_jde}' and d.wk_inout = '${jde.wk_inout_jde}' and d.jml_satuan = ${parseFloat(jde.jml_satuan_jde)} and d.created_at <= '${tanggal}' and kd_dok = 'X' order by jml_satuan asc`);   
                if(dataTps2.length > 0){
                    dataTpsNew.push(dataTps2[0]);
                    
                }else{
                    // ========= INSERT DATA ======
                    // ====== HEADER ===========
                    const values = [[jde.OTDOC, 'X', 'CSMI', jde.IMDSC1, jde.TPCINV, '-', null, '-', '-', 'FTP', 'S', null, 2]]
                    const result = await executeQuery('insert into adjustment_header( `doc_no`, `kd_dok`, `kd_tps`, `nm_angkut`, `no_voy_flight`, `call_sign`, `tgl_tiba`, `kd_gudang`, `ref_number`, `insert_from`, `status`, `user_id`, `company_profile_id`) VALUES (?)',values); 
                    const idRes = result.insertId;
                    // ======  HEADER ===========
                    // ====== DETAIL ===========
                    const valuesDetail = [
                        [idRes, '1', '-', '2021-09-09', '', 'PT. CASTROL MANUFACTURING INDONESIA', jde.OTBC11, '2021-09-10', jde.OTPOSN, 'ST-1206', jde.OTQTY, jde.OUTOM, '1', jde.OTDNIO, null, jde.OTDIOT, '-', '-', 'SGSIN', 'SGSIN', 'IDMRK', '36003_IM', jde.OTLITM, '23010493_OV', '', '0', '']
                    ] 
                    await executeQuery('insert into adjustment_detail( `adjustment_header_id`, `seri_out`, `no_bl_awb`, `tgl_bl_awb`, `id_consignee`, `consignee`, `no_bc11`, `tgl_bc11`, `no_pos_bc11`, `no_tangki`, `jml_satuan`, `jns_satuan`, `kd_dok_inout`, `no_dok_inout`, `tgl_dok_inout`, `wk_inout`, `kd_sar_angkut_inout`, `no_pol`, `pel_muat`, `pel_transit`, `pel_bongkar`, `jde_co_doc_ty`, `jde_item_code`, `jde_related_doc`, `future_use_01`, `future_use_04`, `future_use_07`) VALUES (?)',valuesDetail); 
                    // ====== DETAIL ===========
                    // ========= INSERT DATA ======
                    jdeId.push(jde.id);
                    dataTpsNew.push({id:null})
                } 
            }
            dataNotMatch[index].fromJDE = {tps:dataTpsNew,jde:dataJde};
        }
        res.render('generate_compare',{data : dataNotMatch,tpsId:tpsId,jdeId:jdeId,tpsDetailId:tpsDetailId,tpsDetailId:tpsDetailId,title:title} );

    }
    static async adjustmentY(req,res){
            const title = "Adjustment Y"
            const dataMatch = await executeQuery(queryNotMatchAdjustmentY);
            const dataNotMatch = dataMatch.filter(match => match.compare == "NO")
            let tpsId = [];
            let tpsDetailId = [];
            let jdeId = [];
            let queryNotMatchJdeIn = '';
            for (let index = 0; index < dataNotMatch.length; index++) {
                const notMatch = dataNotMatch[index];
                const whereTps = []
                if(notMatch.jde_item_code){
                    whereTps.push(`jde_item_code = '${notMatch.jde_item_code}'`)
                }
                if(notMatch.no_bc11){
                    whereTps.push(`no_bc11 = '${notMatch.no_bc11}'`)
                }
                if(notMatch.no_pos_bc11){
                    whereTps.push(`no_pos_bc11 = '${notMatch.no_pos_bc11}'`)
                }
                queryNotMatchJdeIn = `('${notMatch.jde_item_code}','${notMatch.no_bc11}','${notMatch.no_pos_bc11}','Y')`;
                let dataTpsNew = [];
                let dataJdeNew = [];  
                var dataTps = await executeQuery(`select adjustment_header_id,d.id,jde_item_code,no_bc11,no_pos_bc11,jml_satuan,wk_inout from adjustment_detail d inner join adjustment_header h on h.id = d.adjustment_header_id where  ${whereTps.join(" and ")}and d.created_at <= '${tanggal}' and kd_dok = 'Y' order by jml_satuan asc`);
                
                for (let index = 0; index < dataTps.length; index++) {
                    const tps = dataTps[index];
                    var dataJde = await executeQuery(`select id,OTLITM as jde_item_code_jde,OTBC11 as no_bc11_jde,OTPOSN as no_pos_bc11_jde,OTQTY as jml_satuan_jde,OTDIOT AS wk_inout_jde,jde_tps.* from jde_tps where OTLITM = '${tps.jde_item_code}' and OTBC11 = '${tps.no_bc11}' and OTPOSN = '${tps.no_pos_bc11}' and OTDCCD = 'Y' and OTDIOT = '${tps.wk_inout}'  order by OTQTY asc`); 
                    if(dataJde.length > 0){
                        dataJdeNew.push(dataJde[0]);
                    }else{
                        tpsId.push(tps.adjustment_header_id);
                        tpsDetailId.push(tps.id);
                        dataJdeNew.push({id:null});
                    }
                }
                dataNotMatch[index].fromTPS = {tps:dataTps,jde:dataJdeNew};
                if(tpsId.length > 0){
                    await executeQuery(`delete from adjustment_header where id in(${tpsId.join(",")})`); 
                }
        
                if(tpsDetailId.length > 0){
                    await executeQuery(`delete from adjustment_detail where id in(${tpsDetailId.join(",")})`); 
                }
        
                var dataJde = await executeQuery(`select id,OTLITM as jde_item_code_jde,OTBC11 as no_bc11_jde,OTPOSN as no_pos_bc11_jde,OTQTY as jml_satuan_jde,OTDIOT AS wk_inout_jde,jde_tps.* from jde_tps where(OTLITM,OTBC11,OTPOSN,OTDCCD) in (${queryNotMatchJdeIn}) order by OTQTY asc`); 
                //menampung data jde
                for (let index = 0; index < dataJde.length; index++) {
                    const jde = dataJde[index];
                    let dataTps2 = await executeQuery(`select d.id,jde_item_code,no_bc11,no_pos_bc11,jml_satuan from  adjustment_detail d inner join adjustment_header h on h.id = d.adjustment_header_id where d.jde_item_code = '${jde.jde_item_code_jde}' and d.no_bc11 = '${jde.no_bc11_jde}' and d.no_pos_bc11 = '${jde.no_pos_bc11_jde}' and d.wk_inout = '${jde.wk_inout_jde}' and d.jml_satuan = ${parseFloat(jde.jml_satuan_jde)} and d.created_at <= '${tanggal}' and kd_dok = 'Y' order by jml_satuan asc`);   
                    if(dataTps2.length > 0){
                        dataTpsNew.push(dataTps2[0]);
                        
                    }else{
                        // ========= INSERT DATA ======
                        // ====== HEADER ===========
                        const values = [[jde.OTDOC, 'Y', 'CSMI', jde.IMDSC1, jde.TPCINV, '-', null, '-', '-', 'FTP', 'S', null, 2]]
                        const result = await executeQuery('insert into adjustment_header( `doc_no`, `kd_dok`, `kd_tps`, `nm_angkut`, `no_voy_flight`, `call_sign`, `tgl_tiba`, `kd_gudang`, `ref_number`, `insert_from`, `status`, `user_id`, `company_profile_id`) VALUES (?)',values); 
                        const idRes = result.insertId;
                        // ======  HEADER ===========
                        // ====== DETAIL ===========
                        const valuesDetail = [
                            [idRes, '1', '-', '2021-09-09', '', 'PT. CASTROL MANUFACTURING INDONESIA', jde.OTBC11, '2021-09-10', jde.OTPOSN, 'ST-1206', jde.OTQTY, jde.OUTOM, '1', jde.OTDNIO, null, jde.OTDIOT, '-', '-', 'SGSIN', 'SGSIN', 'IDMRK', '36003_IM', jde.OTLITM, '23010493_OV', '', '0', '']
                        ] 
                        await executeQuery('insert into adjustment_detail( `adjustment_header_id`, `seri_out`, `no_bl_awb`, `tgl_bl_awb`, `id_consignee`, `consignee`, `no_bc11`, `tgl_bc11`, `no_pos_bc11`, `no_tangki`, `jml_satuan`, `jns_satuan`, `kd_dok_inout`, `no_dok_inout`, `tgl_dok_inout`, `wk_inout`, `kd_sar_angkut_inout`, `no_pol`, `pel_muat`, `pel_transit`, `pel_bongkar`, `jde_co_doc_ty`, `jde_item_code`, `jde_related_doc`, `future_use_01`, `future_use_04`, `future_use_07`) VALUES (?)',valuesDetail); 
                        // ====== DETAIL ===========
                        // ========= INSERT DATA ======
                        jdeId.push(jde.id);
                        dataTpsNew.push({id:null})
                    } 
                }
                dataNotMatch[index].fromJDE = {tps:dataTpsNew,jde:dataJde};
            }
           res.render('generate_compare',{data : dataNotMatch,tpsId:tpsId,jdeId:jdeId,tpsDetailId:tpsDetailId,tpsDetailId:tpsDetailId,title:title} );

    }
     
}