<?php

echo "<H1>PV Solar Report - Administrator Tools</H1>";

echo "<p>";
echo "The purpose of this screen is to allow administrators to manually cleanup the California data.  Please do not share this link with anybody.";
echo "<p>";


//AUTHENTICATE USER
$pw = $_POST['pw'];
if ($pw == "installers"){
	$authenticated_P = TRUE;
}

//============================================================

if ($authenticated_P){

	echo "<BR>Welcome Administrator!  You have logged in successfully<BR><BR>";

	if (isset($_POST['stepx_run_all_jobs'])){
		echo "<font color=\"red\">Step X (All Jobs) Started....  Wait for completion message before proceeding.</font>";
		echo "<BR>";
		echo "<BR>";

		//CODE TO EXECUTE ALL JOBS
		include ('/home1/torrohol/projects/ca_csi/php_code/1_run_all_jobs.php');

		echo "<font color=\"red\">Step X (All Jobs) Completed. You may now proceed.</font>";
	}


	if (isset($_POST['step1_run_data_1'])){
		echo "<font color=\"red\">Step 1 (Download CSI File) Started....  Wait for completion message before proceeding.</font>";
		echo "<BR>";
		echo "<BR>";

		//CODE TO RUN JOB
		download_raw_csi_file();

		echo "<font color=\"red\">Step 1 (Download CSI File) Completed. You may now proceed.</font>";
	}

	else if (isset($_POST['step2_cleanup_installers'])){
		echo "<font color=\"red\">Executing Step 2.  After page has loaded, you may proceed.</font>";
		echo "<BR>";
		echo "<BR>";
	}


	else if (isset($_POST['step3_run_data_2'])){
		echo "<font color=\"red\">Step 3 (Run Cleanup SQL Script) Started... Wait for completion message before proceeding.</font>";
		echo "<BR>";
		echo "<BR>";

		//CODE TO RUN JOB
		run_cleanup_sql();

		echo "<font color=\"red\">Step 3 (Run Cleanup SQL Script) Completed. You may now proceed.</font>";


	}


	echo "<HR>";
	//---------------------------------------
	//STEP X - RUN ALL JOBS
	//---------------------------------------

	echo "<form action=\"admin.php\" method=\"POST\">";
	echo "Step X. Run all jobs";

	echo "<input type='hidden' name='stepx_run_all_jobs' value='TRUE'>";

	echo "<input type=\"submit\" name=\"Button\" value=\"Run\">";

	echo "</form>";

	echo "<HR>";


	//---------------------------------------
	//STEP 1
	//---------------------------------------

	echo "<form action=\"admin.php\" method=\"POST\">";
	echo "Step 1. Download data - first time";

	//echo "<table>";
	//echo "<tr>";
	//echo "<td style=\"text-align: left; font-weight: bold\">To</td>";
	//echo "</tr>";
	//echo "<tr>";
	//echo "<td><input type='text' name='fieldname1' value='' size='30' maxsize='60'><BR><A HREF=\"\fieldname1\">fieldname1</A></td>";
	//echo "</tr>";
	//echo "</table>";

	echo "<input type='hidden' name='step1_run_data_1' value='TRUE'>";

	echo "<input type=\"submit\" name=\"Button\" value=\"Run\">";

	echo "</form>";


	//---------------------------------------
	//STEP 2
	//---------------------------------------
	echo "<BR>";

	echo "<form action=\"admin.php\" method=\"POST\">";
	echo "Step 2. Cleanup installers";

	echo "<input type='hidden' name='step2_cleanup_installers' value='TRUE'>";

	echo "<input type=\"submit\" name=\"Button\" value=\"Run\">";

	echo "</form>";


	//---------------------------------------
	//STEP 3
	//---------------------------------------
	echo "<BR>";

	echo "<form action=\"admin.php\" method=\"POST\">";

	echo "Step 3. Run data - second time";

	echo "<input type='hidden' name='step3_run_data_2' value='TRUE'>";

	echo "<input type=\"submit\" name=\"Button\" value=\"Run\">";

	echo "</form>";

	echo "<BR>";
	//--------------------------------------

}
//END IF LOGGED IN
else {

	echo "<FORM ACTION=\"admin.php\" METHOD=\"POST\">";
	echo "Please login:<BR>";
	echo "<INPUT TYPE=\"password\" NAME=\"pw\"></INPUT>";
	echo "<INPUT TYPE=\"submit\" VALUE=\"Login\">";
	echo "</FORM>";

}

//=======================================
//=======================================
//=======================================

function download_raw_csi_file(){

	ini_set("memory_limit","128M");

	//http://us4.php.net/manual/en/book.curl.php
	//$new_filename = time();
	//if (!preg_match('/^[-_a-z0-9]+$/i', $_GET['id'])) $filename = strip_tags($_GET['id']);
	//if (file_exists('/usr/home/user/files/'.$filename.'.txt'))


	$new_filename = 'csi_raw.csv';
	$mycurl = curl_init();
	curl_setopt($mycurl, CURLOPT_URL, 'http://www.californiasolarstatistics.org/csv/?and_or=and&agency=all');


	curl_setopt($mycurl, CURLOPT_HEADER, true);
	curl_setopt($mycurl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($mycurl, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($mycurl, CURLOPT_AUTOREFERER, true);
	$curl_output = curl_exec($mycurl);
	if(!curl_errno($mycurl))
	{
	  header('Content-type:text/plain');
	  header('Content-Disposition: attachment; filename ="'.$new_filename.'.txt"');
	  echo($curl_output);
	  exit();
	}
	else
	{
	  echo(curl_error($mycurl));
	}

}

//=========================================





function run_cleanup_sql(){


	echo "here1\n";

	//VARS
	$sql_script_name = 'CSI_SQL.sql';
	$db_user = 'torrohol_nik';
	$db_pw = 'installers';
	$db_name = 'localhost';
	$host_name = 'torrohol_ca_csi';


	echo "here2\n";

	$sql_file = '/home1/torrohol/projects/ca_csi/sql_scripts/' . $sql_script_name;

	$contents = file_get_contents($sql_file);

	echo "here3\n";

	// Remove C style and inline comments
	$comment_patterns = array(
	'/\/\*.*(\n)*.*(\*\/)?/', //C comments
	'/\s*--.*\n/' //inline comments start with --
	);

	//'/\s*#.*\n/' //inline comments start with #

	echo "here4\n\n\n\n";

	$contents = preg_replace($comment_patterns, "\n", $contents);

	//Retrieve sql statements
	$statements = explode(";\n", $contents);
	$statements = preg_replace("/\s/", ' ', $statements);

	require_once 'MDB2.php';

	//echo $sql_file;

	$mdb2 =& MDB2::connect("mysql://$db_user:$db_pw@$db_name/$host_name");

	echo "mysql://$db_user:$db_pw@$db_name/$host_name\n\n";
	echo "here5\n\n\n\n";

	foreach ($statements as $query) {
		if (trim($query) != '') {
			echo 'Executing query: ' . $query . "\n";
			$res = $mdb2->exec($query);

			if (PEAR::isError($res)) {
				die($res->getMessage());
			}
		}
	}
	echo "here6-COMPLETED ALL QUERIES\n\n\n\n";

}


//=================================================




?>