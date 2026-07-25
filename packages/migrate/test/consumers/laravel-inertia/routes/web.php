<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('Home', ['pageName' => 'Home']));
Route::get('/second', fn () => Inertia::render('Home', ['pageName' => 'Second']));
