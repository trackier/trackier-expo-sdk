package com.trackierexposdk

import android.util.Log
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType

object TrackierUtil {

  fun toMap(readableMap: ReadableMap?): Map<String, Any>? {
    if (readableMap == null) {
      return null
    }

    val iterator = readableMap.keySetIterator()
    if (!iterator.hasNextKey()) {
      return null
    }

    val result = mutableMapOf<String, Any>()
    try {
      while (iterator.hasNextKey()) {
        val key = iterator.nextKey()
        val value = toObject(readableMap, key) ?: continue
        result[key] = value.toString()
      }
    } catch (e: Exception) {
      Log.e("trackiersdk", "Error converting ReadableMap to Map: ${e.message}", e)
      return result
    }
    return result
  }

  private fun toObject(readableMap: ReadableMap?, key: String): Any? {
    if (readableMap == null) {
      return null
    }

    val readableType = readableMap.getType(key)
    return when (readableType) {
      ReadableType.Null -> null
      ReadableType.Boolean -> readableMap.getBoolean(key)
      ReadableType.Number -> {
        val tmp = readableMap.getDouble(key)
        if (tmp == tmp.toInt().toDouble()) {
          tmp.toInt()
        } else {
          tmp
        }
      }
      ReadableType.String -> readableMap.getString(key)
      ReadableType.Map -> toMap(readableMap.getMap(key))
      ReadableType.Array -> toList(readableMap.getArray(key))
      else -> null
    }
  }

  private fun toList(readableArray: ReadableArray?): List<Any>? {
    if (readableArray == null) {
      return null
    }

    val result = mutableListOf<Any>()
    for (i in 0 until readableArray.size()) {
      val item = readableArray.getDynamic(i)
      result.add(item)
    }
    return result
  }
}

