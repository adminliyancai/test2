$package("com.sgcc.pmp.res.dp.service");
com.sgcc.pmp.res.dp.service.DPTaskManage = function(params){
	this.params = params;
};
com.sgcc.pmp.res.dp.service.DPTaskManage.prototype = {
	init : function(){
		this.initPageParam();
		this.setTableColumn();
		this.refreshDataTable();
	},
	initPageParam : function(){
		var self=this;
		self.cs.invoke('initPageParam',[],function(data){
			self.deptCode = data.deptCode;
			self.deptName = data.deptName;
			self.userName = data.userName;
		});
	},
	setTableColumn : function(){
		this.dsDataSource.setCols([
	        {name:'choose', header:' ',style:'3',width:'20',align:'center',readOnly:false},
		    {name:'row_num', header:'序号',computer:'getrow()+1',style:'0',width:'40',align:'center',readOnly:true},
   			{name:'task_name', header:'服务名称',style:'0',width:'100',align:'left',readOnly:false},
   			{name:'prj_table_name', header:'目标表名',style:'0',width:'100',align:'left',readOnly:false},
   			{name:'dp_url', header:'服务URL',style:'0',width:'100',align:'left',readOnly:false},
   			{name:'prj_dele_sql', header:'中台数据删除SQL',style:'0',width:'100',align:'left',readOnly:false},
   			{name:'prj_dele_para', header:'中台数据删除参数',style:'0',width:'100',align:'left',readOnly:false},
   			{name:'task_period', header:'任务周期',style:'comboBox',width:'60',align:'center',dataValues:'1|2|3|4|5',displayValues:'年|季|月|周|天',readOnly:false},
   			{name:'task_start_time', header:'执行时刻',style:'datePicker',width:'60',align:'center',readOnly:false,format:'HH:mm'},
   			{name:'task_sort_no', header:'排序号',style:'0',width:'50',align:'center',readOnly:false},
   			{name:'task_create_time', header:'创建日期',style:'datePicker',width:'120',align:'center',readOnly:true,format:'yyyy-MM-dd HH:mm:ss'},
   			{name:'task_create_dept', header:'创建单位',style:'0',width:'100',align:'left',readOnly:true},
   			{name:'task_create_user', header:'创建人',style:'0',width:'100',align:'left',readOnly:true},
   			{name:'run_result', header:'最近一次执行结果',style:'comboBox',width:'100',align:'center',dataValues:'1|0',displayValues:'成功|失败',readOnly:true},
   			{name:'user_operate', header:'操作',style:'0',width:'100',align:'center',readOnly:true}
   		]);
		this.dataTable.cellRenderer = this.dataTable.cellRenderer||{};
		this.dataTable.cellRenderer["user_operate"]= function(table, row, col, td, isCurrent, isSelect) {
			$(td).css('text-align','center');
			$(td).html('<a style="color:blue;cursor:pointer;" onclick="pageForm.runDPTask('+row+')">执行</a>');
		};
	},
	runDPTask : function(tableRow){
		var self = this;
		var taskID = self.dsDataSource.getData(tableRow,"task_id");
//		alert(taskID);
		self.cs.invoke("executeDPApi",{'taskID':taskID},function(result){
			if(result.error) return alert(result.error);
			Rcp.tip('执行成功');
		});
	},
	refreshDataTable : function(){
		var self = this;
		var apiName = self.apiNameCombo.getValue();
		self.dsDataSource.queryCount = 0;
		self.dsDataSource.queryData("queryDataTable",{'apiName':apiName},function(resultMap){
			self.dataTable.setCurrentRow(0);
		});
	},
	btnQuery_onclick : function(){
		this.refreshDataTable();
	},
	btnReset_onclick : function(){
		$("#apiNameCombo").val("");
		this.refreshDataTable();
	},
	btnAdd_onclick : function(){
		var addRow = this.dsDataSource.addRow();
		var currDate = Rcp.formatDate(new Date(),'yyyy-MM-dd HH:mm:ss');
		this.dsDataSource.setData(addRow,'task_create_time',currDate);
		this.dsDataSource.setData(addRow,'task_id',this.getUUID());
		this.dsDataSource.setData(addRow,'task_create_dept',this.deptName);
		this.dsDataSource.setData(addRow,'task_create_user',this.userName);
		this.dsDataSource.setCurrentRow(addRow);
	},
	btnDel_onclick : function(){
		var rowCount = this.dsDataSource.getRowCount();
		var rows = this.dsDataSource.findRows(0,rowCount,"choose='1'");
		if(rows.length!=0){
			for(var i=0;i<rows.length;i++){
				this.dsDataSource.deleteRow(rows[rows.length-i-1]);
			}
		}else{
			this.dsDataSource.deleteRow(this.dsDataSource.getCurrentRow());
		}
	},
	btnSave_onclick : function(){
		var self = this;
		if(!this.dsDataSource.isChanged()){
			Rcp.MessageBox.info({message:'数据未发生变化，无需保存！'});
			return;
		}
		var rows = self.dsDataSource.getRowCount();
		for(var i=0;i<rows;i++){
			var taskName = self.dsDataSource.getData(i,"task_name");
			if(taskName==""||taskName==null){
				self.dsDataSource.setCurrentRow(i);
				SoData.info('服务名称不能为空，请检查！');
				return;
			}
		}
		self.dsDataSource.update("Save",function(data){
			if(data.error){
				Rcp.MessageBox.info({message:data.error});
			}else{
				Rcp.tip('保存成功!');
				self.refreshDataTable();
			}
		});
	},
	getUUID:function(){
		var newUUID = '';
		this.cs.synvoke('getUUID',[],function(data){
			newUUID = data;
		});
		return newUUID;
	},
	doLayout : function(){
		this.rootPane.doLayout();
	}
}