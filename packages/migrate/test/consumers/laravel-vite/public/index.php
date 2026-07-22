<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));
require __DIR__.'/../vendor/autoload.php';

/** @var Illuminate\Foundation\Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->handleRequest(Request::capture());
