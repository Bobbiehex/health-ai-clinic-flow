export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          {
            foreignKeyName: "appointment_waitlist_preferred_doctor_id_fkey"
            columns: ["preferred_doctor_id"]
            isOneToOne: false
            referencedRelation: "users"
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
            foreignKeyName: "appointments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
            foreignKeyName: "maintenance_schedules_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
            foreignKeyName: "medical_records_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      messages: {
        Row: {
          content: string
          created_at: string | null
          file_url: string | null
          id: string
          is_read: boolean | null
          is_urgent: boolean | null
          message_type: Database["public"]["Enums"]["message_type"] | null
          patient_id: string | null
          read_at: string | null
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean | null
          is_urgent?: boolean | null
          message_type?: Database["public"]["Enums"]["message_type"] | null
          patient_id?: string | null
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean | null
          is_urgent?: boolean | null
          message_type?: Database["public"]["Enums"]["message_type"] | null
          patient_id?: string | null
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "patients_primary_doctor_id_fkey"
            columns: ["primary_doctor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "resource_alerts_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          p_start_time: string
          p_end_time: string
          p_doctor_id?: string
          p_room_id?: string
          p_exclude_appointment_id?: string
        }
        Returns: {
          conflict_type: string
          conflicting_appointment_id: string
          conflict_details: Json
        }[]
      }
      find_optimal_appointment_slots: {
        Args: {
          p_date: string
          p_duration_minutes?: number
          p_doctor_id?: string
          p_room_type?: string
        }
        Returns: {
          suggested_time: string
          confidence_score: number
          available_doctor_id: string
          available_room_id: string
          optimization_factors: Json
        }[]
      }
      generate_maintenance_alerts: {
        Args: Record<PropertyKey, never>
        Returns: {
          equipment_id: string
          alert_type: string
          severity: string
          message: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_medical_staff: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      optimize_resource_allocation: {
        Args: { p_date: string; p_optimization_goals?: string[] }
        Returns: {
          room_id: string
          equipment_recommendations: string[]
          optimization_score: number
          energy_savings_estimate: number
          cost_savings_estimate: number
          utilization_improvement: number
          recommendations: Json
        }[]
      }
      update_room_occupancy: {
        Args: {
          p_room_id: string
          p_appointment_id?: string
          p_temperature?: number
          p_sensor_data?: Json
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
