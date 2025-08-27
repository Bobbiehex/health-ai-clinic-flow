export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ai_insights: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          created_by_ai_model: string | null
          data_points: Json | null
          description: string | null
          expires_at: string | null
          id: string
          implementation_notes: string | null
          is_implemented: boolean | null
          recommendations: string[] | null
          target_entity_id: string | null
          target_entity_type: string | null
          title: string
          type: Database["public"]["Enums"]["insight_type"]
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          created_by_ai_model?: string | null
          data_points?: Json | null
          description?: string | null
          expires_at?: string | null
          id?: string
          implementation_notes?: string | null
          is_implemented?: boolean | null
          recommendations?: string[] | null
          target_entity_id?: string | null
          target_entity_type?: string | null
          title: string
          type: Database["public"]["Enums"]["insight_type"]
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          created_by_ai_model?: string | null
          data_points?: Json | null
          description?: string | null
          expires_at?: string | null
          id?: string
          implementation_notes?: string | null
          is_implemented?: boolean | null
          recommendations?: string[] | null
          target_entity_id?: string | null
          target_entity_type?: string | null
          title?: string
          type?: Database["public"]["Enums"]["insight_type"]
        }
        Relationships: []
      }
      analytics_data: {
        Row: {
          additional_data: Json | null
          created_at: string | null
          date_recorded: string
          department: string | null
          id: string
          metric_category: string
          metric_name: string
          time_period: string | null
          unit: string | null
          value: number
        }
        Insert: {
          additional_data?: Json | null
          created_at?: string | null
          date_recorded: string
          department?: string | null
          id?: string
          metric_category: string
          metric_name: string
          time_period?: string | null
          unit?: string | null
          value: number
        }
        Update: {
          additional_data?: Json | null
          created_at?: string | null
          date_recorded?: string
          department?: string | null
          id?: string
          metric_category?: string
          metric_name?: string
          time_period?: string | null
          unit?: string | null
          value?: number
        }
        Relationships: []
      }
      appointment_notifications: {
        Row: {
          appointment_id: string
          created_at: string
          id: string
          message: string
          notification_type: string
          recipient_email: string
          scheduled_for: string
          sent_at: string | null
          status: string | null
          subject: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          id?: string
          message: string
          notification_type: string
          recipient_email: string
          scheduled_for: string
          sent_at?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          id?: string
          message?: string
          notification_type?: string
          recipient_email?: string
          scheduled_for?: string
          sent_at?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_notifications_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_waitlist: {
        Row: {
          created_at: string
          id: string
          patient_id: string
          preferred_date: string | null
          preferred_doctor_id: string | null
          preferred_time_end: string | null
          preferred_time_start: string | null
          priority_level: number | null
          reason_for_visit: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          patient_id: string
          preferred_date?: string | null
          preferred_doctor_id?: string | null
          preferred_time_end?: string | null
          preferred_time_start?: string | null
          priority_level?: number | null
          reason_for_visit?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          patient_id?: string
          preferred_date?: string | null
          preferred_doctor_id?: string | null
          preferred_time_end?: string | null
          preferred_time_start?: string | null
          priority_level?: number | null
          reason_for_visit?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_waitlist_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          ai_confidence_score: number | null
          ai_optimized: boolean | null
          appointment_date: string
          created_at: string | null
          created_by: string | null
          doctor_id: string | null
          end_time: string
          id: string
          notes: string | null
          patient_id: string | null
          reason_for_visit: string | null
          room_id: string | null
          start_time: string
          status: Database["public"]["Enums"]["appointment_status"] | null
          updated_at: string | null
        }
        Insert: {
          ai_confidence_score?: number | null
          ai_optimized?: boolean | null
          appointment_date: string
          created_at?: string | null
          created_by?: string | null
          doctor_id?: string | null
          end_time: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          reason_for_visit?: string | null
          room_id?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string | null
        }
        Update: {
          ai_confidence_score?: number | null
          ai_optimized?: boolean | null
          appointment_date?: string
          created_at?: string | null
          created_by?: string | null
          doctor_id?: string | null
          end_time?: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          reason_for_visit?: string | null
          room_id?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      call_sessions: {
        Row: {
          connection_data: Json | null
          conversation_id: string
          created_at: string
          duration_seconds: number | null
          ended_at: string | null
          id: string
          initiated_by: string
          is_emergency_call: boolean | null
          participants: string[] | null
          quality_rating: number | null
          recording_url: string | null
          started_at: string | null
          status: string | null
          type: string
        }
        Insert: {
          connection_data?: Json | null
          conversation_id: string
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          initiated_by: string
          is_emergency_call?: boolean | null
          participants?: string[] | null
          quality_rating?: number | null
          recording_url?: string | null
          started_at?: string | null
          status?: string | null
          type: string
        }
        Update: {
          connection_data?: Json | null
          conversation_id?: string
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          initiated_by?: string
          is_emergency_call?: boolean | null
          participants?: string[] | null
          quality_rating?: number | null
          recording_url?: string | null
          started_at?: string | null
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_sessions_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          is_muted: boolean | null
          joined_at: string
          last_read_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          is_muted?: boolean | null
          joined_at?: string
          last_read_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          is_muted?: boolean | null
          joined_at?: string
          last_read_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_emergency: boolean | null
          title: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_emergency?: boolean | null
          title?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_emergency?: boolean | null
          title?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      energy_usage: {
        Row: {
          baseline_consumption: number | null
          carbon_footprint_kg: number | null
          consumption_kwh: number
          cost_usd: number | null
          created_at: string
          efficiency_rating: number | null
          id: string
          measurement_period_hours: number | null
          measurement_timestamp: string
          peak_usage_time: string | null
          resource_id: string
          resource_type: string
          savings_vs_baseline: number | null
        }
        Insert: {
          baseline_consumption?: number | null
          carbon_footprint_kg?: number | null
          consumption_kwh: number
          cost_usd?: number | null
          created_at?: string
          efficiency_rating?: number | null
          id?: string
          measurement_period_hours?: number | null
          measurement_timestamp?: string
          peak_usage_time?: string | null
          resource_id: string
          resource_type: string
          savings_vs_baseline?: number | null
        }
        Update: {
          baseline_consumption?: number | null
          carbon_footprint_kg?: number | null
          consumption_kwh?: number
          cost_usd?: number | null
          created_at?: string
          efficiency_rating?: number | null
          id?: string
          measurement_period_hours?: number | null
          measurement_timestamp?: string
          peak_usage_time?: string | null
          resource_id?: string
          resource_type?: string
          savings_vs_baseline?: number | null
        }
        Relationships: []
      }
      equipment: {
        Row: {
          alert_thresholds: Json | null
          created_at: string | null
          efficiency_rating: number | null
          energy_consumption_kwh: number | null
          id: string
          iot_sensor_data: Json | null
          last_maintenance: string | null
          maintenance_cost: number | null
          maintenance_notes: string | null
          model: string | null
          name: string
          next_maintenance: string | null
          purchase_date: string | null
          room_id: string | null
          serial_number: string | null
          status: Database["public"]["Enums"]["equipment_status"] | null
          type: string
          updated_at: string | null
          utilization_hours: number | null
          warranty_expiry: string | null
        }
        Insert: {
          alert_thresholds?: Json | null
          created_at?: string | null
          efficiency_rating?: number | null
          energy_consumption_kwh?: number | null
          id?: string
          iot_sensor_data?: Json | null
          last_maintenance?: string | null
          maintenance_cost?: number | null
          maintenance_notes?: string | null
          model?: string | null
          name: string
          next_maintenance?: string | null
          purchase_date?: string | null
          room_id?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["equipment_status"] | null
          type: string
          updated_at?: string | null
          utilization_hours?: number | null
          warranty_expiry?: string | null
        }
        Update: {
          alert_thresholds?: Json | null
          created_at?: string | null
          efficiency_rating?: number | null
          energy_consumption_kwh?: number | null
          id?: string
          iot_sensor_data?: Json | null
          last_maintenance?: string | null
          maintenance_cost?: number | null
          maintenance_notes?: string | null
          model?: string | null
          name?: string
          next_maintenance?: string | null
          purchase_date?: string | null
          room_id?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["equipment_status"] | null
          type?: string
          updated_at?: string | null
          utilization_hours?: number | null
          warranty_expiry?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_schedules: {
        Row: {
          actual_cost: number | null
          assigned_technician_id: string | null
          completion_date: string | null
          cost_estimate: number | null
          created_at: string
          equipment_id: string
          estimated_duration_hours: number | null
          id: string
          maintenance_type: string
          notes: string | null
          priority_level: number | null
          scheduled_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          assigned_technician_id?: string | null
          completion_date?: string | null
          cost_estimate?: number | null
          created_at?: string
          equipment_id: string
          estimated_duration_hours?: number | null
          id?: string
          maintenance_type: string
          notes?: string | null
          priority_level?: number | null
          scheduled_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          assigned_technician_id?: string | null
          completion_date?: string | null
          cost_estimate?: number | null
          created_at?: string
          equipment_id?: string
          estimated_duration_hours?: number | null
          id?: string
          maintenance_type?: string
          notes?: string | null
          priority_level?: number | null
          scheduled_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_schedules_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          appointment_id: string | null
          chief_complaint: string | null
          created_at: string | null
          diagnosis: string[] | null
          doctor_id: string | null
          follow_up_instructions: string | null
          id: string
          imaging_results: Json | null
          lab_results: Json | null
          medications_prescribed: string[] | null
          notes: string | null
          patient_id: string | null
          treatment_plan: string | null
          updated_at: string | null
          visit_date: string
          vital_signs: Json | null
        }
        Insert: {
          appointment_id?: string | null
          chief_complaint?: string | null
          created_at?: string | null
          diagnosis?: string[] | null
          doctor_id?: string | null
          follow_up_instructions?: string | null
          id?: string
          imaging_results?: Json | null
          lab_results?: Json | null
          medications_prescribed?: string[] | null
          notes?: string | null
          patient_id?: string | null
          treatment_plan?: string | null
          updated_at?: string | null
          visit_date: string
          vital_signs?: Json | null
        }
        Update: {
          appointment_id?: string | null
          chief_complaint?: string | null
          created_at?: string | null
          diagnosis?: string[] | null
          doctor_id?: string | null
          follow_up_instructions?: string | null
          id?: string
          imaging_results?: Json | null
          lab_results?: Json | null
          medications_prescribed?: string[] | null
          notes?: string | null
          patient_id?: string | null
          treatment_plan?: string | null
          updated_at?: string | null
          visit_date?: string
          vital_signs?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          content_type: string | null
          conversation_id: string | null
          created_at: string | null
          edited_at: string | null
          encryption_key_id: string | null
          file_mime_type: string | null
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          is_deleted: boolean | null
          is_encrypted: boolean | null
          is_read: boolean | null
          is_urgent: boolean | null
          message_type: Database["public"]["Enums"]["message_type"] | null
          metadata: Json | null
          patient_id: string | null
          priority: string | null
          read_at: string | null
          receiver_id: string | null
          reply_to_message_id: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          content_type?: string | null
          conversation_id?: string | null
          created_at?: string | null
          edited_at?: string | null
          encryption_key_id?: string | null
          file_mime_type?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_deleted?: boolean | null
          is_encrypted?: boolean | null
          is_read?: boolean | null
          is_urgent?: boolean | null
          message_type?: Database["public"]["Enums"]["message_type"] | null
          metadata?: Json | null
          patient_id?: string | null
          priority?: string | null
          read_at?: string | null
          receiver_id?: string | null
          reply_to_message_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          content_type?: string | null
          conversation_id?: string | null
          created_at?: string | null
          edited_at?: string | null
          encryption_key_id?: string | null
          file_mime_type?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_deleted?: boolean | null
          is_encrypted?: boolean | null
          is_read?: boolean | null
          is_urgent?: boolean | null
          message_type?: Database["public"]["Enums"]["message_type"] | null
          metadata?: Json | null
          patient_id?: string | null
          priority?: string | null
          read_at?: string | null
          receiver_id?: string | null
          reply_to_message_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_message_id_fkey"
            columns: ["reply_to_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          delivery_method: string[] | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          metadata: Json | null
          priority: string | null
          read_at: string | null
          related_id: string | null
          scheduled_for: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          delivery_method?: string[] | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          priority?: string | null
          read_at?: string | null
          related_id?: string | null
          scheduled_for?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          delivery_method?: string[] | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          priority?: string | null
          read_at?: string | null
          related_id?: string | null
          scheduled_for?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          allergies: string[] | null
          blood_type: string | null
          created_at: string | null
          current_medications: string[] | null
          date_of_birth: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          gender: string | null
          id: string
          insurance_policy_number: string | null
          insurance_provider: string | null
          medical_history: string | null
          patient_id: string
          primary_doctor_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          allergies?: string[] | null
          blood_type?: string | null
          created_at?: string | null
          current_medications?: string[] | null
          date_of_birth: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          gender?: string | null
          id?: string
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          medical_history?: string | null
          patient_id: string
          primary_doctor_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          allergies?: string[] | null
          blood_type?: string | null
          created_at?: string | null
          current_medications?: string[] | null
          date_of_birth?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          gender?: string | null
          id?: string
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          medical_history?: string | null
          patient_id?: string
          primary_doctor_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
        }
        Relationships: []
      }
      resource_alerts: {
        Row: {
          alert_data: Json | null
          alert_type: string
          auto_generated: boolean | null
          created_at: string
          id: string
          is_resolved: boolean | null
          message: string
          resolved_at: string | null
          resolved_by: string | null
          resource_id: string
          resource_type: string
          severity: string | null
          title: string
        }
        Insert: {
          alert_data?: Json | null
          alert_type: string
          auto_generated?: boolean | null
          created_at?: string
          id?: string
          is_resolved?: boolean | null
          message: string
          resolved_at?: string | null
          resolved_by?: string | null
          resource_id: string
          resource_type: string
          severity?: string | null
          title: string
        }
        Update: {
          alert_data?: Json | null
          alert_type?: string
          auto_generated?: boolean | null
          created_at?: string
          id?: string
          is_resolved?: boolean | null
          message?: string
          resolved_at?: string | null
          resolved_by?: string | null
          resource_id?: string
          resource_type?: string
          severity?: string | null
          title?: string
        }
        Relationships: []
      }
      resource_allocations: {
        Row: {
          actual_usage_metrics: Json | null
          ai_recommendations: Json | null
          allocation_date: string
          appointment_id: string | null
          created_at: string
          energy_efficiency_score: number | null
          equipment_ids: string[] | null
          id: string
          optimization_score: number | null
          room_id: string
          updated_at: string
          utilization_rate: number | null
        }
        Insert: {
          actual_usage_metrics?: Json | null
          ai_recommendations?: Json | null
          allocation_date: string
          appointment_id?: string | null
          created_at?: string
          energy_efficiency_score?: number | null
          equipment_ids?: string[] | null
          id?: string
          optimization_score?: number | null
          room_id: string
          updated_at?: string
          utilization_rate?: number | null
        }
        Update: {
          actual_usage_metrics?: Json | null
          ai_recommendations?: Json | null
          allocation_date?: string
          appointment_id?: string | null
          created_at?: string
          energy_efficiency_score?: number | null
          equipment_ids?: string[] | null
          id?: string
          optimization_score?: number | null
          room_id?: string
          updated_at?: string
          utilization_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_allocations_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_allocations_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_occupancy: {
        Row: {
          actual_usage_minutes: number | null
          created_at: string
          energy_consumption_kwh: number | null
          expected_duration_minutes: number | null
          id: string
          occupancy_sensors: Json | null
          occupied_by_appointment_id: string | null
          occupied_since: string | null
          room_id: string
          temperature_celsius: number | null
          updated_at: string
        }
        Insert: {
          actual_usage_minutes?: number | null
          created_at?: string
          energy_consumption_kwh?: number | null
          expected_duration_minutes?: number | null
          id?: string
          occupancy_sensors?: Json | null
          occupied_by_appointment_id?: string | null
          occupied_since?: string | null
          room_id: string
          temperature_celsius?: number | null
          updated_at?: string
        }
        Update: {
          actual_usage_minutes?: number | null
          created_at?: string
          energy_consumption_kwh?: number | null
          expected_duration_minutes?: number | null
          id?: string
          occupancy_sensors?: Json | null
          occupied_by_appointment_id?: string | null
          occupied_since?: string | null
          room_id?: string
          temperature_celsius?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_occupancy_occupied_by_appointment_id_fkey"
            columns: ["occupied_by_appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_occupancy_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          capacity: number | null
          created_at: string | null
          equipment_list: string[] | null
          id: string
          last_maintenance: string | null
          next_maintenance: string | null
          notes: string | null
          room_number: string
          room_type: string
          status: Database["public"]["Enums"]["room_status"] | null
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          equipment_list?: string[] | null
          id?: string
          last_maintenance?: string | null
          next_maintenance?: string | null
          notes?: string | null
          room_number: string
          room_type: string
          status?: Database["public"]["Enums"]["room_status"] | null
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          equipment_list?: string[] | null
          id?: string
          last_maintenance?: string | null
          next_maintenance?: string | null
          notes?: string | null
          room_number?: string
          room_type?: string
          status?: Database["public"]["Enums"]["room_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          email: string
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          license_number: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          specialization: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          first_name: string
          id: string
          is_active?: boolean | null
          last_name: string
          license_number?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          specialization?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          license_number?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          specialization?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_appointment_conflicts: {
        Args: {
          p_appointment_date: string
          p_doctor_id?: string
          p_end_time: string
          p_exclude_appointment_id?: string
          p_room_id?: string
          p_start_time: string
        }
        Returns: {
          conflict_details: Json
          conflict_type: string
          conflicting_appointment_id: string
        }[]
      }
      create_notification: {
        Args: {
          p_content: string
          p_priority?: string
          p_related_id?: string
          p_title: string
          p_type: string
          p_user_id: string
        }
        Returns: string
      }
      find_optimal_appointment_slots: {
        Args: {
          p_date: string
          p_doctor_id?: string
          p_duration_minutes?: number
          p_room_type?: string
        }
        Returns: {
          available_doctor_id: string
          available_room_id: string
          confidence_score: number
          optimization_factors: Json
          suggested_time: string
        }[]
      }
      generate_maintenance_alerts: {
        Args: Record<PropertyKey, never>
        Returns: {
          alert_type: string
          equipment_id: string
          message: string
          severity: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_or_create_direct_conversation: {
        Args: { p_user1_id: string; p_user2_id: string }
        Returns: string
      }
      is_medical_staff: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      mark_messages_as_read: {
        Args: { p_conversation_id: string; p_user_id?: string }
        Returns: undefined
      }
      optimize_resource_allocation: {
        Args: { p_date: string; p_optimization_goals?: string[] }
        Returns: {
          cost_savings_estimate: number
          energy_savings_estimate: number
          equipment_recommendations: string[]
          optimization_score: number
          recommendations: Json
          room_id: string
          utilization_improvement: number
        }[]
      }
      update_room_occupancy: {
        Args: {
          p_appointment_id?: string
          p_room_id: string
          p_sensor_data?: Json
          p_temperature?: number
        }
        Returns: string
      }
    }
    Enums: {
      appointment_status:
        | "scheduled"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "no_show"
      equipment_status: "available" | "in_use" | "maintenance" | "out_of_order"
      insight_type:
        | "scheduling_optimization"
        | "resource_allocation"
        | "patient_flow"
        | "cost_reduction"
      message_type: "text" | "file" | "image" | "urgent"
      room_status:
        | "available"
        | "occupied"
        | "maintenance"
        | "cleaning"
        | "reserved"
      user_role: "admin" | "doctor" | "nurse" | "patient"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_status: [
        "scheduled",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
      ],
      equipment_status: ["available", "in_use", "maintenance", "out_of_order"],
      insight_type: [
        "scheduling_optimization",
        "resource_allocation",
        "patient_flow",
        "cost_reduction",
      ],
      message_type: ["text", "file", "image", "urgent"],
      room_status: [
        "available",
        "occupied",
        "maintenance",
        "cleaning",
        "reserved",
      ],
      user_role: ["admin", "doctor", "nurse", "patient"],
    },
  },
} as const
