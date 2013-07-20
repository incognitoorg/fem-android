define(function(require) {
	var Sandbox = require('sandbox');
	var user = require('components/login/login');
	var expenseTemplate = Handlebars.compile(require('text!./../../templates/expense.html'));
	var expenseDeatailTemplate = Handlebars.compile(require('text!./../../templates/detailexpenseview.html'));
	
//	var strolljs = require('plugins/jquery/stroll/js/stroll.min');
//	var strollcss = require('css!plugins/jquery/stroll/css/stroll-stripped.css');

	var css = require('css!./../../css/expensehistory.css');
	
	var ExpenseHistoryView = Sandbox.View.extend({
		initialize : function(options) {
			this.options = _.extend({
			//defaults here
			}, options);
			this.expenses=[];
			this.expenseHitoryMap = {};
			this.render();
			this.getExpenses();
		},
		reInitialize : function(){
			this.getExpenses();
		},
		template : Handlebars
				.compile(require('text!./../../templates/expensehistory.html')),
		render : function(data) {
			$(this.el).html(this.template(data));
		},
		events : {
			'click .expense' : 'showExpenseDetail'
		},
		getExpenses : function(){
			var data = {
				url : '_ah/api/userendpoint/v1/user/' + user.getInfo().userId + '/expenses',
				callback : this.showExpenseHistory,
				context : this,
				cached : true,
				loaderContainer : this.$('.js-expenses-container')
			};
			Sandbox.doGet(data);
		},
		showExpenseHistory : function(response){
			
			var expenses = response.items;
			this.expenses = expenses;
			var userInfo = user.getInfo();
			var groups = userInfo.group.items;
			var allMembers = {};
			var groupMap = {};
			for(var groupIndex in groups){
				var groupInfo = groups[groupIndex];
				for(var memberIndex in groupInfo.members ){
					allMembers[groupInfo.members[memberIndex].userId] = groupInfo.members[memberIndex];
				}
				groupMap[groupInfo.groupId] = groupInfo;
				
			}

			this.$('.js-expenses-container').show();
			this.$('.js-detail-expnese-container').hide();
			
			function normalizeExpense(expense){
				//var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
				for ( var i = 0; i < expense.listIncludeMemberInfo.length; i++) {
					var memberInfo = expense.listIncludeMemberInfo[i];
					memberInfo.userInfo = allMembers[memberInfo.userId];
					if(memberInfo.userId== user.getInfo().userId){
						expense.userExpenseAmount=parseInt(memberInfo.amount);
					}
				}
				
				for ( var i = 0; i < expense.listPayersInfo.length; i++) {
					var memberInfo = expense.listPayersInfo[i];
					memberInfo.userInfo = allMembers[memberInfo.userId];
				}
				expense.day = new Date(expense.date).toDateString();
				//expense.date = new Date(expense.date);
				expense.group = expense.groupId && groupMap[expense.groupId];
				return expense;
			}
			
			
			
			expenses = expenses.sort(function(a,b){
				 return a.date<b.date?1:a.date>b.date?-1:0;
			});
			
			var expensesContainer = this.$('.js-expenses-container').html('');
			
			
			var userInfo = user.getInfo();
			
			for ( var i = 0; i < expenses.length; i++) {
				var expense = expenses[i];
				this.expenseHitoryMap[expense.expenseEntityId] = expense;
				
				//TODO : Convert this into view
				var html = expenseTemplate(normalizeExpense(expense));
				expensesContainer.append(html);
				
			}
			
			this.$('.js-expenses-container').height($(window).height()-$('.js-show-hide-section').height());
			//stroll.bind( this.$( '.js-expenses-container'));
			
			
		},
		showExpenseDetail : function(event){
			this.$('.js-expenses-container').hide();
			this.$('.js-detail-expnese-container').show();
			
			var expense = this.expenseHitoryMap[$(event.currentTarget).data('expense-id')];
			
			var userInfo = user.getInfo();
			
			var detailHTML = expenseDeatailTemplate(expense);
			
			this.$('.js-detail-expnese-container').html(detailHTML);
			Sandbox.publish('FEM:NAVIGATE', '#expensedetail');
		}
	});

	return ExpenseHistoryView;

});