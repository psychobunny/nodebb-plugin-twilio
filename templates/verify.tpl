<div class="well">
	We've just sent you a confirmation code to {mobileNumber}. If you don't receive one in the next few minutes, click <a href="#" id="resend">here</a> to generate a new code.

	<input type="text" title="Length" id="code" class="form-control" placeholder="Confirmation Code"><br />
	<button class="btn btn-lg btn-primary" id="save">Confirm</button>
</div>

<script type="text/javascript">
$("#resend").on('click', function(ev) {
	socket.emit('user.emailConfirm');
	ev.preventDefault();
	ev.stopPropagation();
	return false;
});

$('#save').on('click', function() {
	$.get('/api/confirm/' + $('#code').val(), function(data) {
		if (!data.status) {
			app.alertError('Sorry, you\'ve entered an incorrect code.');
		} else {
			window.location.href = '/';
			app.alertSuccess('Successfully confirmed email!');
		}
	});
});
</script>