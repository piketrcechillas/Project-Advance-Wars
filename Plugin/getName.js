function getName()
{
	var shell = new ActiveXObject("WScript.shell");
	shell.CurrentDirectory = "C:\\Users\\ngocp\\Desktop\\Project1";
	var WshExec = shell.Exec('java -jar dialogbox.jar');
	var InStream = WshExec.StdIn;
	var OutStream = WshExec.StdOut;
	var Str = "";
	while (!OutStream.atEndOfStream) {
    	Str = Str + OutStream.readAll();
	}

	text = Str.substring(0, Str.length - 2)
	root.log(Str.substring(0, Str.length - 2));
	return text
}

