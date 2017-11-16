<?php

namespace App\Modules;

function IsNullOrEmptyString($question)
{
    return (!isset($question) || trim($question)==='');
}